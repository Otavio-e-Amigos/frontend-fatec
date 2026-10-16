import { useState, type FormEvent } from "react";
import type Curso from "~/modules/curso/curso.class";
import formatTurno from "~/modules/curso/format-turno";
import type Disciplina from "~/modules/disciplina/disciplina.class";
import type {
	GradeDisciplinePayload,
	SavedGradeDiscipline,
	SavedGradeLesson,
} from "~/modules/grade/grade.service";
import { getLessonBlocks, shifts } from "./grade-wizard.utils";

type EditableGradeDiscipline = SavedGradeDiscipline & {
	lessons: SavedGradeLesson[];
};

type GradeDisciplineEditDialogProps = {
	discipline: EditableGradeDiscipline;
	cursos: Curso[];
	disciplinas: Disciplina[];
	isSaving: boolean;
	errorMessage: string;
	onSave: (payload: GradeDisciplinePayload) => Promise<void>;
	onCancel: () => void;
};

/** Edits the course, subject, workload, OP, and status of a grade discipline. */
export default function GradeDisciplineEditDialog({
	discipline,
	cursos,
	disciplinas,
	isSaving,
	errorMessage,
	onSave,
	onCancel,
}: GradeDisciplineEditDialogProps) {
	const [disciplinaId, setDisciplinaId] = useState(
		String(discipline.disciplinaId),
	);
	const [cursoId, setCursoId] = useState(String(discipline.cursoId));
	const [semestreCurso, setSemestreCurso] = useState(
		String(discipline.semestreCurso),
	);
	const [quantidadeAulas, setQuantidadeAulas] = useState(
		String(discipline.quantidadeAulas),
	);
	const [op, setOp] = useState(discipline.op == null ? "" : String(discipline.op));
	const [status, setStatus] = useState(discipline.status);

	const selectedCourse = cursos.find((course) => String(course.id) === cursoId);
	const selectedShift = selectedCourse?.turno;
	const currentShift = shifts.find(
		(shift) => shift.value === discipline.periodo,
	);
	const allocatedBlocks = currentShift
		? discipline.lessons.reduce(
				(total, lesson) =>
					total + getLessonBlocks(currentShift, lesson).length,
				0,
			)
		: discipline.lessons.length;
	const availableCourses = cursos.filter(
		(course) =>
			!discipline.lessons.length ||
			course.turno === discipline.periodo ||
			String(course.id) === String(discipline.cursoId),
	);

	/** Validates editable discipline values and submits them to the API. */
	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const parsedDisciplineId = Number(disciplinaId);
		const parsedCourseId = Number(cursoId);
		const parsedSemester = Number(semestreCurso);
		const parsedLessonCount = Number(quantidadeAulas);
		const parsedOp = op.trim() ? Number(op) : null;

		if (
			!Number.isSafeInteger(parsedDisciplineId) ||
			parsedDisciplineId < 1 ||
			!Number.isSafeInteger(parsedCourseId) ||
			parsedCourseId < 1 ||
			!Number.isSafeInteger(parsedSemester) ||
			parsedSemester < 1 ||
			parsedSemester > 12 ||
			!Number.isSafeInteger(parsedLessonCount) ||
			parsedLessonCount < allocatedBlocks ||
			(parsedOp !== null &&
				(!Number.isSafeInteger(parsedOp) || parsedOp < 0 || parsedOp > 999)) ||
			!selectedShift
		) {
			return;
		}

		await onSave({
			gradeId: discipline.gradeId,
			disciplinaId: parsedDisciplineId,
			cursoId: parsedCourseId,
			semestreCurso: parsedSemester,
			periodo: selectedShift,
			quantidadeAulas: parsedLessonCount,
			op: parsedOp,
			status,
		});
	}

	return (
		<div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/50 p-4">
			<section
				role="dialog"
				aria-modal="true"
				aria-labelledby="grade-discipline-edit-title"
				className="surface my-auto w-full max-w-2xl rounded-card p-6 shadow-card"
			>
				<header className="mb-5 border-b border-line pb-3">
					<h2
						id="grade-discipline-edit-title"
						className="text-xl font-semibold text-brand"
					>
						Editar disciplina da grade
					</h2>
					<p className="mt-1 text-sm text-ink-muted">
						Os horários já cadastrados não são alterados por este formulário.
					</p>
				</header>

				<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
					<div className="grid gap-3 sm:grid-cols-2">
						<label className="flex flex-col gap-1 text-sm font-medium text-ink-muted">
							Disciplina
							<select
								className="form-input"
								value={disciplinaId}
								onChange={(event) =>
									setDisciplinaId(event.currentTarget.value)
								}
								required
							>
								<option value="">Selecione...</option>
								{disciplinas.map((item) => (
									<option key={item.id} value={item.id}>
										{item.nome}
									</option>
								))}
							</select>
						</label>
						<label className="flex flex-col gap-1 text-sm font-medium text-ink-muted">
							Curso
							<select
								className="form-input"
								value={cursoId}
								onChange={(event) => setCursoId(event.currentTarget.value)}
								required
							>
								<option value="">Selecione...</option>
								{availableCourses.map((course) => (
									<option key={course.id} value={course.id}>
										{course.nome} ({formatTurno(course.turno ?? "")})
									</option>
								))}
							</select>
						</label>
						<label className="flex flex-col gap-1 text-sm font-medium text-ink-muted">
							Semestre do curso
							<input
								className="form-input"
								type="number"
								min="1"
								max="12"
								step="1"
								value={semestreCurso}
								onChange={(event) =>
									setSemestreCurso(event.currentTarget.value)
								}
								required
							/>
						</label>
						<label className="flex flex-col gap-1 text-sm font-medium text-ink-muted">
							Turno
							<input
								className="form-input"
								value={
									selectedCourse?.turno
										? formatTurno(selectedCourse.turno)
										: "Selecione um curso"
								}
								readOnly
							/>
						</label>
						<label className="flex flex-col gap-1 text-sm font-medium text-ink-muted">
							Aulas por semana
							<input
								className="form-input"
								type="number"
								min={allocatedBlocks}
								step="1"
								value={quantidadeAulas}
								onChange={(event) =>
									setQuantidadeAulas(event.currentTarget.value)
								}
								required
							/>
							{discipline.lessons.length > 0 && (
								<span className="text-xs font-normal text-ink-muted">
									A carga não pode ficar abaixo dos {allocatedBlocks} blocos já
									ocupados; para trocar de turno, remova primeiro os horários
									cadastrados.
								</span>
							)}
						</label>
						<label className="flex flex-col gap-1 text-sm font-medium text-ink-muted">
							OP (opcional)
							<input
								className="form-input"
								type="number"
								min="0"
								max="999"
								step="1"
								value={op}
								onChange={(event) => setOp(event.currentTarget.value)}
							/>
						</label>
						<label className="flex flex-col gap-1 text-sm font-medium text-ink-muted sm:col-span-2">
							Status
							<select
								className="form-input"
								value={status}
								onChange={(event) =>
									setStatus(
										event.currentTarget.value === "CANCELADA"
											? "CANCELADA"
											: "MINISTRANDO",
									)
								}
								required
							>
								<option value="MINISTRANDO">MINISTRANDO</option>
								<option value="CANCELADA">CANCELADA</option>
							</select>
						</label>
					</div>

					{errorMessage && (
						<p className="text-sm text-danger-fg" role="alert">
							{errorMessage}
						</p>
					)}

					<footer className="mt-2 flex justify-end gap-2">
						<button
							type="button"
							className="btn"
							data-variant="secondary"
							onClick={onCancel}
							disabled={isSaving}
						>
							Cancelar
						</button>
						<button type="submit" className="btn" disabled={isSaving}>
							{isSaving ? "Salvando..." : "Salvar alterações"}
						</button>
					</footer>
				</form>
			</section>
		</div>
	);
}
