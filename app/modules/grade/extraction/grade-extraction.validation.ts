import {
	courseKey,
	disciplineKey,
	findCourse,
	findDiscipline,
	findPeriod,
	findProfessor,
	type GradeRegistry,
} from "./grade-extraction.registry";
import {
	CONTRACT_OPTIONS,
	PERIOD_OPTIONS,
	STATUS_OPTIONS,
	TITLE_OPTIONS,
	weekdayLabel,
	type ExtractedGrade,
	type GradeImportExtras,
	type Option,
} from "./grade-extraction.types";

export type GradeImportErrors = {
	/** key = field path, e.g. "professor.cpf", "disciplinas.0.aulas.1.horaFim", "extras.professorTitle" */
	fields: Record<string, string>;
	general: string[];
};

const TIME = /^([01]?\d|2[0-3]):([0-5]\d)$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const NAME = /^[\p{L}\s.'-]+$/u;
const ACRONYM = /^[A-Z]{2,10}$/;
const CODE = /^[A-Za-z0-9-]+$/;

export const hasErrors = (errors: GradeImportErrors) =>
	Object.keys(errors.fields).length > 0 || errors.general.length > 0;

const inOptions = (options: Option[], value: string) =>
	options.some((option) => option.value === value);

function minutes(value: string): number | null {
	const match = TIME.exec(value.trim());
	return match ? Number(match[1]) * 60 + Number(match[2]) : null;
}

function isValidDate(value: string) {
	if (!DATE.test(value)) return false;
	const [year, month, day] = value.split("-").map(Number);
	const date = new Date(Date.UTC(year, month - 1, day));
	return (
		date.getUTCFullYear() === year &&
		date.getUTCMonth() === month - 1 &&
		date.getUTCDate() === day
	);
}

export function validateGradeImport(
	grade: ExtractedGrade,
	extras: GradeImportExtras,
	registry: GradeRegistry,
): GradeImportErrors {
	const fields: Record<string, string> = {};
	const general: string[] = [];

	// Academic period
	if (grade.semestre == null || grade.semestre < 1 || grade.semestre > 2)
		fields["semestre"] = "Semestre inválido (deve ser 1 ou 2).";
	if (grade.ano == null || grade.ano < 2000 || grade.ano > 2100)
		fields["ano"] = "Ano inválido.";

	const startOk = isValidDate(grade.validadeInicio);
	const endOk = isValidDate(grade.validadeFim);
	if (!grade.validadeInicio) fields["validadeInicio"] = "Informe a validade início.";
	else if (!startOk) fields["validadeInicio"] = "Data inválida.";
	if (!grade.validadeFim) fields["validadeFim"] = "Informe a validade fim.";
	else if (!endOk) fields["validadeFim"] = "Data inválida.";
	if (startOk && endOk && grade.validadeFim < grade.validadeInicio)
		fields["validadeFim"] = "A validade fim não pode ser anterior à validade início.";

	if (!findPeriod(registry, grade)) {
		if (!extras.periodStart) fields["extras.periodStart"] = "Informe a data inicial do período.";
		if (!extras.periodEnd) fields["extras.periodEnd"] = "Informe a data final do período.";
		if (extras.periodStart && extras.periodEnd && extras.periodEnd <= extras.periodStart)
			fields["extras.periodEnd"] = "A data final deve ser posterior à inicial.";
	}

	// Professor
	const professor = grade.professor;
	const professorExists = !!findProfessor(registry, professor);
	if (!professor.nome.trim()) fields["professor.nome"] = "Informe o nome do docente.";
	else if (!professorExists && !NAME.test(professor.nome.trim()))
		fields["professor.nome"] = "O nome não pode conter números.";
	if (!professor.matricula.trim()) fields["professor.matricula"] = "Informe a matrícula.";
	else if (!professorExists && professor.matricula.trim().length < 5)
		fields["professor.matricula"] = "A matrícula deve ter ao menos 5 caracteres.";
	if (professor.cpf.replace(/\D/g, "").length !== 11)
		fields["professor.cpf"] = "CPF inválido (deve ter 11 dígitos).";
	if (!inOptions(CONTRACT_OPTIONS, professor.contrato))
		fields["professor.contrato"] = "Selecione o contrato.";
	if (!professorExists && !inOptions(TITLE_OPTIONS, extras.professorTitle))
		fields["extras.professorTitle"] = "Selecione a titulação.";

	// Disciplines and lessons
	if (!grade.disciplinas.length) general.push("Adicione ao menos uma disciplina.");

	type Block = {
		i: number;
		j: number;
		label: string;
		day: number;
		start: number;
		end: number;
		from: string;
		to: string;
	};
	const blocks: Block[] = [];

	grade.disciplinas.forEach((item, i) => {
		const base = `disciplinas.${i}`;
		const label = item.nome.trim() || `Disciplina #${i + 1}`;
		const courseComplete =
			item.curso.trim() !== "" && inOptions(PERIOD_OPTIONS, item.periodo);

		if (!item.nome.trim()) fields[`${base}.nome`] = "Informe o nome.";
		if (!item.curso.trim()) fields[`${base}.curso`] = "Informe o curso.";
		if (!inOptions(PERIOD_OPTIONS, item.periodo))
			fields[`${base}.periodo`] = "Selecione o período.";
		if (!inOptions(STATUS_OPTIONS, item.status))
			fields[`${base}.status`] = "Selecione o status.";

		if (item.quantidadeAulas == null)
			fields[`${base}.quantidadeAulas`] = "Informe a quantidade de aulas.";
		else if (item.quantidadeAulas !== item.aulas.length)
			fields[`${base}.quantidadeAulas`] =
				`Informa ${item.quantidadeAulas} aula(s), mas há ${item.aulas.length} horário(s).`;

		// Complementary data for what will be created
		if (courseComplete && !findCourse(registry, item.curso, item.periodo)) {
			const key = courseKey(item.curso, item.periodo);
			if (!NAME.test(item.curso.trim()))
				fields[`${base}.curso`] = "O nome do curso não pode conter números.";
			if (!ACRONYM.test((extras.courseAcronyms[key] ?? "").trim().toUpperCase()))
				fields[`extras.course.${key}`] = "A sigla deve ter de 2 a 10 letras.";
		}
		if (item.nome.trim() && !findDiscipline(registry, item.nome)) {
			const key = disciplineKey(item.nome);
			const code = (extras.disciplineCodes[key] ?? "").trim();
			if (!NAME.test(item.nome.trim()))
				fields[`${base}.nome`] = "O nome não pode conter números.";
			if (!code) fields[`extras.disciplineCode.${key}`] = "Informe o código.";
			else if (!CODE.test(code) || code.length > 10)
				fields[`extras.disciplineCode.${key}`] = "Use até 10 letras, números ou hífen.";
			if (!ACRONYM.test((extras.disciplineAcronyms[key] ?? "").trim().toUpperCase()))
				fields[`extras.disciplineAcronym.${key}`] = "A sigla deve ter de 2 a 10 letras.";
		}

		item.aulas.forEach((lesson, j) => {
			const path = `${base}.aulas.${j}`;
			const dayOk = lesson.diaSemana != null && lesson.diaSemana >= 1 && lesson.diaSemana <= 7;
			const start = minutes(lesson.horaInicio);
			const end = minutes(lesson.horaFim);

			if (!dayOk) fields[`${path}.diaSemana`] = "Selecione o dia.";
			if (start == null)
				fields[`${path}.horaInicio`] = lesson.horaInicio ? "Use HH:mm." : "Informe o início.";
			if (end == null)
				fields[`${path}.horaFim`] = lesson.horaFim ? "Use HH:mm." : "Informe o término.";

			if (start != null && end != null && end <= start) {
				fields[`${path}.horaFim`] = "O término deve ser posterior ao início.";
			} else if (dayOk && start != null && end != null) {
				blocks.push({
					i, j, label,
					day: lesson.diaSemana as number,
					start, end,
					from: lesson.horaInicio,
					to: lesson.horaFim,
				});
			}
		});
	});

	// Overlaps on the same day, across all disciplines
	for (let x = 0; x < blocks.length; x++) {
		for (let y = x + 1; y < blocks.length; y++) {
			const a = blocks[x];
			const b = blocks[y];
			if (a.day === b.day && a.start < b.end && b.start < a.end) {
				general.push(
					`Conflito de horário na ${weekdayLabel(a.day).toLowerCase()}: ${a.label} (${a.from}–${a.to}) e ${b.label} (${b.from}–${b.to}).`,
				);
				fields[`disciplinas.${a.i}.aulas.${a.j}.horaInicio`] ??= "Conflito de horário.";
				fields[`disciplinas.${b.i}.aulas.${b.j}.horaInicio`] ??= "Conflito de horário.";
			}
		}
	}

	return { fields, general };
}