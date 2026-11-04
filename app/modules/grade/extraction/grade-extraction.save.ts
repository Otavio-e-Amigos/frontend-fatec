import Curso from "../../curso/curso.class";
import CursoService from "../../curso/curso.service";
import Disciplina from "../../disciplina/disciplina.class";
import DisciplinaService from "../../disciplina/disciplina.service";
import PeriodoLetivoService from "../../periodo-letivo/periodo-letivo.service";
import Professor from "../../professor/professor.class";
import ProfessorService from "../../professor/professor.service";
import type User from "../../user/user.class";
import GradeService, { type GradeLessonPayload } from "../grade.service";
import GradeExtractionService from "./grade-extraction.service";
import {
	courseKey,
	disciplineKey,
	findCourse,
	findDiscipline,
	findPeriod,
	findProfessor,
	type GradeRegistry,
} from "./grade-extraction.registry";
import type {
	ExtractedGrade,
	ExtractedLesson,
	GradeImportExtras,
	ImportedGradeResult,
} from "./grade-extraction.types";

function requireId(entity: { id?: number } | undefined, label: string): number {
	if (!entity?.id) throw new Error(`A API não retornou o identificador de ${label}.`);
	return entity.id;
}

/** Joins back-to-back 50-minute blocks of the same day: 07:30–08:20 + 08:20–09:10 => 07:30–09:10. */
export function mergeLessons(lessons: ExtractedLesson[]): GradeLessonPayload[] {
	const sorted = lessons
		.filter((lesson) => lesson.diaSemana != null)
		.map((lesson) => ({
			diaSemana: lesson.diaSemana as number,
			horaInicio: lesson.horaInicio,
			horaFim: lesson.horaFim,
		}))
		.sort(
			(a, b) =>
				a.diaSemana - b.diaSemana || a.horaInicio.localeCompare(b.horaInicio),
		);

	const merged: GradeLessonPayload[] = [];
	for (const lesson of sorted) {
		const last = merged[merged.length - 1];
		if (last && last.diaSemana === lesson.diaSemana && last.horaFim === lesson.horaInicio) {
			last.horaFim = lesson.horaFim;
		} else {
			merged.push({ ...lesson });
		}
	}
	return merged;
}

async function loadRegistry(auth: User): Promise<GradeRegistry> {
	const [professores, periodos, cursos, disciplinas] = await Promise.all([
		ProfessorService.get(auth),
		PeriodoLetivoService.get(auth),
		CursoService.get(auth),
		DisciplinaService.getAllForGrade(auth),
	]);
	return { professores, periodos, cursos, disciplinas };
}

/**
 * Saves the extracted grade, creating only what does not exist yet.
 * It reads the registry again before saving, so retrying after a partial failure
 * skips what was already created.
 */
export async function saveExtractedGrade(
	input: ExtractedGrade,
	extras: GradeImportExtras,
	auth: User,
): Promise<ImportedGradeResult> {
	// the API revalidates and normalizes the (possibly corrected) data
	const data = await GradeExtractionService.validate(input, auth);
	const registry = await loadRegistry(auth);
	const summary: string[] = [];

	// Professor
	let professorId = findProfessor(registry, data.professor)?.id;
	const professorExisted = professorId !== undefined;
	if (!professorId) {
		const created = await ProfessorService.save(
			new Professor({
				name: data.professor.nome,
				cpf: data.professor.cpf,
				registry: data.professor.matricula,
				contract: data.professor.contrato,
				status: "ATIVO",
				title: extras.professorTitle,
				code: extras.professorCode.trim(),
			}),
			auth,
		);
		professorId = requireId(created, "o docente");
		summary.push("Docente cadastrado.");
	}

	// Academic period
	let periodId = findPeriod(registry, data)?.id;
	if (!periodId) {
		const created = await PeriodoLetivoService.save(
			{
				semestre: data.semestre as number,
				ano: data.ano as number,
				dataInicio: extras.periodStart,
				dataFim: extras.periodEnd,
			},
			auth,
		);
		periodId = requireId(created, "o período letivo");
		summary.push(`Período letivo ${data.ano}/${data.semestre} cadastrado.`);
	}

	// Grade (reuses the professor's grade for the same period)
	const grades = professorExisted
		? await GradeService.getProfessorGrades(professorId, auth)
		: [];
	let gradeId = grades.find((grade) => grade.periodoLetivoId === periodId)?.id;
	const gradeExisted = gradeId !== undefined;
	if (!gradeId) {
		gradeId = await GradeService.createGrade(
			{
				professorId,
				periodoLetivoId: periodId,
				semanal: data.horas.semanalAula,
				mensal: data.horas.mensalAula,
				total: data.horas.totalMensal,
			},
			auth,
		);
		summary.push("Grade criada.");
	} else {
		summary.push("O docente já tinha grade neste período: só o que faltava foi adicionado.");
	}

	// Courses, disciplines, grade disciplines and lessons
	const courseIds = new Map<string, number>();
	const disciplineIds = new Map<string, number>();
	const savedDisciplines = gradeExisted
		? await GradeService.getGradeDisciplines(gradeId, auth)
		: [];
	let disciplinesCreated = 0;
	let lessonsCreated = 0;

	for (const item of data.disciplinas) {
		const ck = courseKey(item.curso, item.periodo);
		let courseId = findCourse(registry, item.curso, item.periodo)?.id ?? courseIds.get(ck);
		if (!courseId) {
			const created = await CursoService.save(
				new Curso({
					nome: item.curso,
					turno: item.periodo,
					sigla: (extras.courseAcronyms[ck] ?? "").trim().toUpperCase(),
				}),
				auth,
			);
			courseId = requireId(created, "o curso");
			courseIds.set(ck, courseId);
			summary.push(`Curso ${item.curso} cadastrado.`);
		}

		const dk = disciplineKey(item.nome);
		let disciplineId = findDiscipline(registry, item.nome)?.id ?? disciplineIds.get(dk);
		if (!disciplineId) {
			const created = await DisciplinaService.save(
				new Disciplina({
					nome: item.nome,
					codigo: (extras.disciplineCodes[dk] ?? "").trim(),
					sigla: (extras.disciplineAcronyms[dk] ?? "").trim().toUpperCase(),
				}),
				auth,
			);
			disciplineId = requireId(created, "a disciplina");
			disciplineIds.set(dk, disciplineId);
			summary.push(`Disciplina ${item.nome} cadastrada.`);
		}

		let gradeDisciplineId = savedDisciplines.find(
			(saved) => saved.disciplinaId === disciplineId && saved.cursoId === courseId,
		)?.id;
		const savedLessons = gradeDisciplineId
			? await GradeService.getDisciplineLessons(gradeDisciplineId, auth)
			: [];
		if (!gradeDisciplineId) {
			gradeDisciplineId = await GradeService.createDiscipline(
				{
					gradeId,
					disciplinaId: disciplineId,
					cursoId: courseId,
					periodo: item.periodo,
					quantidadeAulas: item.quantidadeAulas ?? item.aulas.length,
					op: item.op,
					status: item.status === "CANCELADA" ? "CANCELADA" : "MINISTRANDO",
				},
				auth,
			);
			disciplinesCreated++;
		}

		for (const lesson of mergeLessons(item.aulas)) {
			const alreadySaved = savedLessons.some(
				(saved) =>
					saved.diaSemana === lesson.diaSemana &&
					saved.horaInicio.slice(0, 5) === lesson.horaInicio &&
					saved.horaFim.slice(0, 5) === lesson.horaFim,
			);
			if (alreadySaved) continue;
			await GradeService.createLesson(gradeDisciplineId, lesson, auth);
			lessonsCreated++;
		}
	}

	summary.push(
		`${disciplinesCreated} disciplina(s) e ${lessonsCreated} horário(s) adicionados à grade.`,
	);

	// month/year of the grade's validity, used by the timesheet preview link
	const [year, month] = data.validadeInicio.split("-").map(Number);
	return {
		professorId,
		month: Number.isInteger(month) ? month : null,
		year: Number.isInteger(year) ? year : null,
		summary,
	};
}