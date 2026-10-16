import { useEffect, useMemo, useState } from "react";
import type Professor from "~/modules/professor/professor.class";
import GradeService, {
	type GradeCreatePayload,
	type GradeDisciplinePayload,
	type GradeLessonPayload,
	type SavedGrade,
	type SavedGradeLesson,
} from "~/modules/grade/grade.service";
import AuthService from "~/modules/user/auth.service";
import type {
	GradeDeleteTarget,
	GradePageProps,
	ScheduleDiscipline,
} from "../grade-page.types";
import { academicKey, periodLabel } from "../grade-page.utils";

/** Owns grade selection, API data, and edit/delete actions for the page. */
export default function useGradePage({
	professores,
	periodos,
	cursos,
	disciplinas,
}: GradePageProps) {
	const latestPeriod = [...periodos].sort(
		(a, b) => academicKey(b) - academicKey(a),
	)[0];
	const [professorQuery, setProfessorQuery] = useState("");
	const [professorId, setProfessorId] = useState("");
	const [showProfessorSuggestions, setShowProfessorSuggestions] =
		useState(false);
	const [periodId, setPeriodId] = useState(String(latestPeriod?.id ?? ""));
	const [grades, setGrades] = useState<SavedGrade[]>([]);
	const [gradeId, setGradeId] = useState("");
	const [schedule, setSchedule] = useState<ScheduleDiscipline[]>([]);
	const [loadingGrades, setLoadingGrades] = useState(false);
	const [loadingSchedule, setLoadingSchedule] = useState(false);
	const [gradesError, setGradesError] = useState("");
	const [scheduleError, setScheduleError] = useState("");
	const [retrySchedule, setRetrySchedule] = useState(0);
	const [isGradeEditorOpen, setIsGradeEditorOpen] = useState(false);
	const [editingDisciplineId, setEditingDisciplineId] = useState<number | null>(
		null,
	);
	const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
	const [isSavingEdit, setIsSavingEdit] = useState(false);
	const [editError, setEditError] = useState("");
	const [lessonEditError, setLessonEditError] = useState("");
	const [isLoadingLessonEdit, setIsLoadingLessonEdit] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState<GradeDeleteTarget | null>(
		null,
	);
	const [isDeleting, setIsDeleting] = useState(false);
	const [deleteError, setDeleteError] = useState("");

	const professor = professores.find(
		(entry) => String(entry.id) === professorId,
	);
	const selectedPeriod = periodos.find(
		(entry) => String(entry.id) === periodId,
	);
	const selectedGrade = grades.find((entry) => String(entry.id) === gradeId);
	const gradesForPeriod = useMemo(
		() => grades.filter((grade) => String(grade.periodoLetivoId) === periodId),
		[grades, periodId],
	);
	const matchingProfessors = useMemo(() => {
		const term = professorQuery.trim().toLocaleLowerCase("pt-BR");
		return professores.filter((entry) =>
			entry.name?.toLocaleLowerCase("pt-BR").includes(term),
		);
	}, [professores, professorQuery]);
	const professorNotFound =
		professorQuery.trim().length >= 2 &&
		!matchingProfessors.length &&
		!professorId;

	/** Closes transient editors and confirmations when the selection changes. */
	function closeGradeActions() {
		setIsGradeEditorOpen(false);
		setEditingDisciplineId(null);
		setEditingLessonId(null);
		setEditError("");
		setLessonEditError("");
		setDeleteTarget(null);
		setDeleteError("");
	}

	useEffect(() => {
		if (!professorId) {
			setGrades([]);
			setGradeId("");
			setGradesError("");
			return;
		}

		let active = true;
		setLoadingGrades(true);
		setGradesError("");
		setGrades([]);
		setGradeId("");

		GradeService.getProfessorGrades(
			Number(professorId),
			AuthService.getUserToken(),
		)
			.then((result) => {
				if (!active) return;
				const ordered = result.sort((a, b) => {
					const periodA = periodos.find(
						(period) => period.id === a.periodoLetivoId,
					);
					const periodB = periodos.find(
						(period) => period.id === b.periodoLetivoId,
					);
					return academicKey(periodB) - academicKey(periodA) || b.id - a.id;
				});
				setGrades(ordered);
				if (ordered.length) {
					const recent = ordered[0];
					setPeriodId(String(recent.periodoLetivoId));
					setGradeId(String(recent.id));
				}
			})
			.catch((error: unknown) => {
				if (active) {
					setGradesError(
						error instanceof Error
							? error.message
							: "Não foi possível consultar as grades deste professor.",
					);
				}
			})
			.finally(() => {
				if (active) setLoadingGrades(false);
			});

		return () => {
			active = false;
		};
	}, [professorId, periodos]);

	useEffect(() => {
		if (!grades.length || !periodId) {
			setGradeId("");
			return;
		}
		const currentGradeIsVisible = gradesForPeriod.some(
			(grade) => String(grade.id) === gradeId,
		);
		if (!currentGradeIsVisible) {
			setGradeId(String(gradesForPeriod[0]?.id ?? ""));
		}
	}, [gradeId, grades, gradesForPeriod, periodId]);

	useEffect(() => {
		if (!selectedGrade) {
			setSchedule([]);
			setScheduleError("");
			return;
		}

		const grade = selectedGrade;
		let active = true;
		setLoadingSchedule(true);
		setScheduleError("");
		setSchedule([]);

		async function loadSchedule() {
			try {
				const gradeDisciplines = await GradeService.getGradeDisciplines(
					grade.id,
					AuthService.getUserToken(),
				);
				const results = await Promise.all(
					gradeDisciplines.map(async (entry) => {
						const lessons = await GradeService.getDisciplineLessons(
							entry.id,
							AuthService.getUserToken(),
						);
						return {
							...entry,
							name:
								disciplinas.find(
									(discipline) => discipline.id === entry.disciplinaId,
								)?.nome ?? `Disciplina ${entry.disciplinaId}`,
							course:
								cursos.find((course) => course.id === entry.cursoId)?.nome ??
								`Curso ${entry.cursoId}`,
							shift: entry.periodo,
							lessons,
						};
					}),
				);
				if (active) setSchedule(results);
			} catch (error) {
				if (active) {
					setScheduleError(
						error instanceof Error
							? error.message
							: "Não foi possível carregar os horários desta grade.",
					);
				}
			} finally {
				if (active) setLoadingSchedule(false);
			}
		}

		void loadSchedule();
		return () => {
			active = false;
		};
	}, [selectedGrade, disciplinas, cursos, retrySchedule]);

	/** Selects a professor and loads that professor's grades. */
	function selectProfessor(nextProfessor: Professor) {
		closeGradeActions();
		setProfessorQuery(nextProfessor.name ?? "");
		setProfessorId(nextProfessor.id ? String(nextProfessor.id) : "");
		setShowProfessorSuggestions(false);
	}

	/** Saves grade totals and updates the currently selected grade. */
	async function updateSelectedGrade(payload: GradeCreatePayload) {
		if (!selectedGrade) return;
		setIsSavingEdit(true);
		setEditError("");
		try {
			const updated = await GradeService.updateGrade(
				selectedGrade.id,
				payload,
				AuthService.getUserToken(),
			);
			setGrades((current) =>
				current.map((grade) => (grade.id === updated.id ? updated : grade)),
			);
			setPeriodId(String(updated.periodoLetivoId));
			setIsGradeEditorOpen(false);
		} catch (error) {
			setEditError(
				error instanceof Error
					? error.message
					: "Não foi possível atualizar a grade.",
			);
		} finally {
			setIsSavingEdit(false);
		}
	}

	/** Saves discipline data and refreshes the corresponding card. */
	async function updateDiscipline(
		discipline: ScheduleDiscipline,
		payload: GradeDisciplinePayload,
	) {
		setIsSavingEdit(true);
		setEditError("");
		try {
			const updated = await GradeService.updateDisciplineGrade(
				discipline.id,
				payload,
				AuthService.getUserToken(),
			);
			setSchedule((current) =>
				current.map((item) =>
					item.id === updated.id
						? {
								...item,
								...updated,
								name:
									disciplinas.find(
										(subject) => subject.id === updated.disciplinaId,
									)?.nome ?? `Disciplina ${updated.disciplinaId}`,
								course:
									cursos.find((course) => course.id === updated.cursoId)?.nome ??
									`Curso ${updated.cursoId}`,
								shift: updated.periodo,
							}
						: item,
				),
			);
			setEditingDisciplineId(null);
		} catch (error) {
			setEditError(
				error instanceof Error
					? error.message
					: "Não foi possível atualizar a disciplina da grade.",
			);
		} finally {
			setIsSavingEdit(false);
		}
	}

	/** Saves updated lesson data in the selected discipline. */
	async function updateLesson(
		lesson: SavedGradeLesson,
		payload: GradeLessonPayload,
	) {
		setIsSavingEdit(true);
		setLessonEditError("");
		try {
			const updated = await GradeService.updateLesson(
				lesson.id,
				payload,
				AuthService.getUserToken(),
			);
			setSchedule((current) =>
				current.map((item) => ({
					...item,
					lessons: item.lessons.map((currentLesson) =>
						currentLesson.id === updated.id ? updated : currentLesson,
					),
				})),
			);
			setEditingLessonId(null);
		} catch (error) {
			setLessonEditError(
				error instanceof Error
					? error.message
					: "Não foi possível atualizar o horário da aula.",
			);
		} finally {
			setIsSavingEdit(false);
		}
	}

	/** Loads the latest lesson values before displaying its editor. */
	async function openLessonEditor(lesson: SavedGradeLesson) {
		setLessonEditError("");
		setEditingLessonId(lesson.id);
		setIsLoadingLessonEdit(true);
		try {
			const latestLesson = await GradeService.getLesson(
				lesson.id,
				AuthService.getUserToken(),
			);
			setSchedule((current) =>
				current.map((item) => ({
					...item,
					lessons: item.lessons.map((currentLesson) =>
						currentLesson.id === latestLesson.id
							? latestLesson
							: currentLesson,
					),
				})),
			);
		} catch (error) {
			setLessonEditError(
				error instanceof Error
					? error.message
					: "Não foi possível carregar os dados atuais do horário.",
			);
		} finally {
			setIsLoadingLessonEdit(false);
		}
	}

	/** Runs the confirmed grade, discipline, or lesson deletion workflow. */
	async function deleteSelectedItem() {
		if (!deleteTarget) return;
		setIsDeleting(true);
		setDeleteError("");
		try {
			if (deleteTarget.kind === "grade") {
				await GradeService.deleteGrade(
					deleteTarget.grade.id,
					AuthService.getUserToken(),
				);
				setGrades((current) =>
					current.filter((grade) => grade.id !== deleteTarget.grade.id),
				);
				setGradeId("");
			} else if (deleteTarget.kind === "discipline") {
				await deleteDisciplineAssociation(deleteTarget.discipline);
			} else {
				await GradeService.deleteLesson(
					deleteTarget.lesson.id,
					AuthService.getUserToken(),
				);
				setSchedule((current) =>
					current.map((item) =>
						item.id === deleteTarget.discipline.id
							? {
									...item,
									lessons: item.lessons.filter(
										(lesson) => lesson.id !== deleteTarget.lesson.id,
									),
								}
							: item,
					),
				);
			}
			setDeleteTarget(null);
		} catch (error) {
			setDeleteError(
				error instanceof Error
					? error.message
					: "Não foi possível concluir a exclusão.",
			);
		} finally {
			setIsDeleting(false);
		}
	}

	/** Cancels a discipline first, then removes its empty cancelled association. */
	async function deleteDisciplineAssociation(discipline: ScheduleDiscipline) {
		if (discipline.status !== "CANCELADA") {
			const updated = await GradeService.updateDisciplineGrade(
				discipline.id,
				{
					gradeId: discipline.gradeId,
					disciplinaId: discipline.disciplinaId,
					cursoId: discipline.cursoId,
					semestreCurso: discipline.semestreCurso,
					periodo: discipline.periodo,
					quantidadeAulas: discipline.quantidadeAulas,
					op: discipline.op,
					status: "CANCELADA",
				},
				AuthService.getUserToken(),
			);
			setSchedule((current) =>
				current.map((item) =>
					item.id === updated.id ? { ...item, ...updated } : item,
				),
			);
			return;
		}

		if (discipline.lessons.length) {
			throw new Error(
				"Exclua primeiro todos os horários desta disciplina para remover o vínculo.",
			);
		}
		await GradeService.deleteDisciplineGrade(
			discipline.id,
			AuthService.getUserToken(),
		);
		setSchedule((current) =>
			current.filter((item) => item.id !== discipline.id),
		);
	}

	const editingDiscipline = schedule.find(
		(item) => item.id === editingDisciplineId,
	);
	const editingLesson = schedule
		.flatMap((item) => item.lessons)
		.find((lesson) => lesson.id === editingLessonId);
	const editingLessonDiscipline = editingLesson
		? schedule.find((item) => item.id === editingLesson.disciplinaGradeId)
		: undefined;

	return {
		selection: {
			professores,
			periodos,
			professorQuery,
			professor,
			selectedPeriod,
			selectedGrade,
			gradesForPeriod,
			gradeId,
			periodId,
			showProfessorSuggestions,
			matchingProfessors,
			loadingGrades,
			gradesError,
			professorNotFound,
			onProfessorQueryChange: (value: string) => {
				closeGradeActions();
				setProfessorQuery(value);
				setProfessorId("");
				setShowProfessorSuggestions(true);
			},
			onProfessorFocus: () => setShowProfessorSuggestions(true),
			onProfessorBlur: () =>
				window.setTimeout(() => setShowProfessorSuggestions(false), 120),
			onSelectProfessor: selectProfessor,
			onPeriodChange: (value: string) => {
				closeGradeActions();
				setPeriodId(value);
			},
			onGradeChange: (value: string) => {
				closeGradeActions();
				setGradeId(value);
			},
		},
		focus: {
			grade: selectedGrade,
			periodLabel: periodLabel(selectedPeriod),
			gradeNumber:
				gradesForPeriod.findIndex((grade) => grade.id === selectedGrade?.id) + 1,
			schedule,
			loadingSchedule,
			scheduleError,
			isSavingEdit,
			isDeleting,
			onRetry: () => setRetrySchedule((current) => current + 1),
			onEditGrade: () => {
				setEditError("");
				setIsGradeEditorOpen(true);
			},
			onDeleteGrade: () => {
				setDeleteError("");
				if (selectedGrade) setDeleteTarget({ kind: "grade", grade: selectedGrade });
			},
			onEditDiscipline: (discipline: ScheduleDiscipline) => {
				setEditError("");
				setEditingDisciplineId(discipline.id);
			},
			onDeleteDiscipline: (discipline: ScheduleDiscipline) => {
				setDeleteError("");
				setDeleteTarget({ kind: "discipline", discipline });
			},
			onEditLesson: openLessonEditor,
			onDeleteLesson: (
				discipline: ScheduleDiscipline,
				lesson: SavedGradeLesson,
			) => {
				setDeleteError("");
				setDeleteTarget({ kind: "lesson", discipline, lesson });
			},
		},
		dialogs: {
			grade: selectedGrade,
			professorName: professor?.name ?? "",
			periodos,
			isGradeEditorOpen,
			editingDiscipline,
			editingLesson,
			editingLessonDiscipline,
			isSavingEdit,
			isLoadingLessonEdit,
			editError,
			lessonEditError,
			deleteTarget,
			isDeleting,
			deleteError,
			onSaveGrade: updateSelectedGrade,
			onSaveDiscipline: updateDiscipline,
			onSaveLesson: updateLesson,
			onDelete: deleteSelectedItem,
			onCancelGradeEdit: () => setIsGradeEditorOpen(false),
			onCancelDisciplineEdit: () => setEditingDisciplineId(null),
			onCancelLessonEdit: () => {
				setEditingLessonId(null);
				setLessonEditError("");
			},
			onCancelDelete: () => {
				if (!isDeleting) {
					setDeleteTarget(null);
					setDeleteError("");
				}
			},
			cursos,
			disciplinas,
		},
	};
}

export type GradePageSelection = ReturnType<typeof useGradePage>["selection"];
export type GradePageFocus = ReturnType<typeof useGradePage>["focus"];
export type GradePageDialogs = ReturnType<typeof useGradePage>["dialogs"];
