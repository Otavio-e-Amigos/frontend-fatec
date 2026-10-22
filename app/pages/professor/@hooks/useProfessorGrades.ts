import { useEffect, useMemo, useRef, useState } from "react";
import getErrorMessage from "~/classes/errors/get-error-message";
import type Curso from "~/modules/curso/curso.class";
import type Disciplina from "~/modules/disciplina/disciplina.class";
import GradeService, { type SavedGrade } from "~/modules/grade/grade.service";
import type PeriodoLetivo from "~/modules/periodo-letivo/periodo-letivo.class";
import AuthService from "~/modules/user/auth.service";
import type { ScheduleDiscipline } from "~/pages/grade/grade-page.types";
import { academicKey, periodLabel } from "~/pages/grade/grade-page.utils";

type Options = {
	professorId: number;
	periodos: PeriodoLetivo[];
	cursos: Curso[];
	disciplinas: Disciplina[];
};

/** Carrega as grades de um professor e os horários da grade selecionada. */
export default function useProfessorGrades({
	professorId,
	periodos,
	cursos,
	disciplinas,
}: Options) {
	// Listas de apoio em refs: não precisam disparar nova busca quando mudam.
	const lookups = useRef({ periodos, cursos, disciplinas });
	lookups.current = { periodos, cursos, disciplinas };

	const [attempt, setAttempt] = useState(0);
	const [grades, setGrades] = useState<SavedGrade[]>([]);
	const [gradeId, setGradeId] = useState<number | null>(null);
	const [loadingGrades, setLoadingGrades] = useState(true);
	const [gradesError, setGradesError] = useState("");

	const [schedule, setSchedule] = useState<ScheduleDiscipline[]>([]);
	const [loadingSchedule, setLoadingSchedule] = useState(false);
	const [scheduleError, setScheduleError] = useState("");

	// 1) Lista de grades do professor, da mais recente para a mais antiga.
	useEffect(() => {
		let active = true;
		setLoadingGrades(true);
		setGradesError("");

		GradeService.getProfessorGrades(professorId, AuthService.getUserToken())
			.then((result) => {
				if (!active) return;
				const { periodos } = lookups.current;
				const ordered = [...result].sort((a, b) => {
					const periodA = periodos.find((p) => p.id === a.periodoLetivoId);
					const periodB = periodos.find((p) => p.id === b.periodoLetivoId);
					return academicKey(periodB) - academicKey(periodA) || b.id - a.id;
				});
				setGrades(ordered);
				setGradeId((current) =>
					ordered.some((grade) => grade.id === current)
						? current
						: (ordered[0]?.id ?? null),
				);
			})
			.catch((error: unknown) => {
				if (!active) return;
				setGradesError(
					getErrorMessage(
						error,
						"Não foi possível consultar as grades deste professor.",
					),
				);
			})
			.finally(() => {
				if (active) setLoadingGrades(false);
			});

		return () => {
			active = false;
		};
	}, [professorId, attempt]);

	// 2) Disciplinas e aulas apenas da grade selecionada.
	useEffect(() => {
		if (gradeId === null) {
			setSchedule([]);
			setScheduleError("");
			return;
		}

		let active = true;
		setLoadingSchedule(true);
		setScheduleError("");
		setSchedule([]);

		async function loadSchedule(id: number) {
			try {
				const auth = AuthService.getUserToken();
				const entries = await GradeService.getGradeDisciplines(id, auth);
				const { cursos, disciplinas } = lookups.current;

				const results: ScheduleDiscipline[] = await Promise.all(
					entries.map(async (entry) => ({
						...entry,
						name:
							disciplinas.find((d) => d.id === entry.disciplinaId)?.nome ??
							`Disciplina ${entry.disciplinaId}`,
						course:
							cursos.find((c) => c.id === entry.cursoId)?.nome ??
							`Curso ${entry.cursoId}`,
						shift: entry.periodo,
						lessons: await GradeService.getDisciplineLessons(entry.id, auth),
					})),
				);
				if (active) setSchedule(results);
			} catch (error) {
				if (active) {
					setScheduleError(
						getErrorMessage(
							error,
							"Não foi possível carregar os horários desta grade.",
						),
					);
				}
			} finally {
				if (active) setLoadingSchedule(false);
			}
		}

		void loadSchedule(gradeId);
		return () => {
			active = false;
		};
	}, [gradeId, attempt]);

	const selectedGrade = useMemo(
		() => grades.find((grade) => grade.id === gradeId),
		[grades, gradeId],
	);

	return {
		grades,
		selectedGrade,
		selectGrade: setGradeId,
		gradeLabel: (grade: SavedGrade) =>
			periodLabel(periodos.find((p) => p.id === grade.periodoLetivoId)),
		schedule,
		loadingGrades,
		gradesError,
		loadingSchedule,
		scheduleError,
		retry: () => setAttempt((value) => value + 1),
	};
}