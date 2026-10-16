import ConfirmationDialog from "~/components/ConfirmationDialog";
import type { GradePageDialogs as GradePageDialogsProps } from "../@hooks/useGradePage";
import GradeDisciplineEditDialog from "./GradeDisciplineEditDialog";
import GradeEditDialog from "./GradeEditDialog";
import GradeLessonEditDialog from "./GradeLessonEditDialog";
import { displayDay } from "../grade-page.utils";

/** Renders the grade, discipline, lesson, and deletion dialogs. */
export default function GradePageDialogs({
	grade,
	professorName,
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
	onSaveGrade,
	onSaveDiscipline,
	onSaveLesson,
	onDelete,
	onCancelGradeEdit,
	onCancelDisciplineEdit,
	onCancelLessonEdit,
	onCancelDelete,
	cursos,
	disciplinas,
}: GradePageDialogsProps) {
	return (
		<>
			{isGradeEditorOpen && grade && (
				<GradeEditDialog
					grade={grade}
					professorName={professorName}
					periodos={periodos}
					isSaving={isSavingEdit}
					errorMessage={editError}
					onSave={onSaveGrade}
					onCancel={onCancelGradeEdit}
				/>
			)}
			{editingDiscipline && (
				<GradeDisciplineEditDialog
					discipline={editingDiscipline}
					cursos={cursos}
					disciplinas={disciplinas}
					isSaving={isSavingEdit}
					errorMessage={editError}
					onSave={(payload) => onSaveDiscipline(editingDiscipline, payload)}
					onCancel={onCancelDisciplineEdit}
				/>
			)}
			{editingLesson && editingLessonDiscipline && (
				<GradeLessonEditDialog
					lesson={editingLesson}
					disciplineName={editingLessonDiscipline.name}
					isSaving={isSavingEdit}
					isLoading={isLoadingLessonEdit}
					errorMessage={lessonEditError}
					onSave={(payload) => onSaveLesson(editingLesson, payload)}
					onCancel={onCancelLessonEdit}
				/>
			)}
			{deleteTarget && (
				<ConfirmationDialog
					title={getDeleteTitle(deleteTarget)}
					description={getDeleteDescription(deleteTarget)}
					confirmLabel={getDeleteButtonLabel(deleteTarget)}
					errorMessage={deleteError}
					onConfirm={onDelete}
					onCancel={onCancelDelete}
				/>
			)}
		</>
	);
}

/** Returns the appropriate title for the current deletion confirmation. */
function getDeleteTitle(target: NonNullable<GradePageDialogsProps["deleteTarget"]>) {
	if (target.kind === "grade") return "Excluir grade?";
	if (target.kind === "lesson") return "Excluir horário de aula?";
	return target.discipline.status === "CANCELADA"
		? "Excluir vínculo definitivamente?"
		: "Desvincular disciplina?";
}

/** Explains exactly which record the confirmed operation changes or removes. */
function getDeleteDescription(
	target: NonNullable<GradePageDialogsProps["deleteTarget"]>,
) {
	if (target.kind === "grade") {
		return "A grade será removida. A API não permite excluir uma grade que ainda possua disciplinas vinculadas; nesse caso, será necessário desvinculá-las primeiro.";
	}
	if (target.kind === "lesson") {
		return `O horário de ${displayDay(target.lesson.diaSemana)}, das ${target.lesson.horaInicio.slice(0, 5)} às ${target.lesson.horaFim.slice(0, 5)}, de ${target.discipline.name}, será removido.`;
	}
	if (target.discipline.status === "CANCELADA") {
		return `O vínculo de ${target.discipline.name} será removido definitivamente da grade. O cadastro global da disciplina não será apagado.`;
	}
	return `Esta etapa altera o status de ${target.discipline.name} para CANCELADA. Depois, exclua os horários associados e use “Excluir vínculo” para remover a associação definitivamente.`;
}

/** Labels the confirm action according to its effect. */
function getDeleteButtonLabel(
	target: NonNullable<GradePageDialogsProps["deleteTarget"]>,
) {
	if (target.kind === "grade" || target.kind === "lesson") return "Excluir";
	return target.discipline.status === "CANCELADA"
		? "Excluir vínculo"
		: "Marcar como CANCELADA";
}
