import { useState, type FormEvent } from "react";
import type {
	GradeLessonPayload,
	SavedGradeLesson,
} from "~/modules/grade/grade.service";

const weekdays = [
	{ value: 1, label: "Segunda-feira" },
	{ value: 2, label: "Terça-feira" },
	{ value: 3, label: "Quarta-feira" },
	{ value: 4, label: "Quinta-feira" },
	{ value: 5, label: "Sexta-feira" },
	{ value: 6, label: "Sábado" },
	{ value: 7, label: "Domingo" },
];

type GradeLessonEditDialogProps = {
	lesson: SavedGradeLesson;
	disciplineName: string;
	isSaving: boolean;
	isLoading: boolean;
	errorMessage: string;
	onSave: (payload: GradeLessonPayload) => Promise<void>;
	onCancel: () => void;
};

/** Edits a lesson's weekday and exact start/end times. */
export default function GradeLessonEditDialog({
	lesson,
	disciplineName,
	isSaving,
	isLoading,
	errorMessage,
	onSave,
	onCancel,
}: GradeLessonEditDialogProps) {
	const [diaSemana, setDiaSemana] = useState(String(lesson.diaSemana));
	const [horaInicio, setHoraInicio] = useState(lesson.horaInicio.slice(0, 5));
	const [horaFim, setHoraFim] = useState(lesson.horaFim.slice(0, 5));
	const [validationError, setValidationError] = useState("");

	/** Validates the time range and submits the lesson update. */
	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (horaFim <= horaInicio) {
			setValidationError("O horário final deve ser posterior ao horário inicial.");
			return;
		}
		setValidationError("");
		await onSave({
			diaSemana: Number(diaSemana),
			horaInicio,
			horaFim,
		});
	}

	return (
		<div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/50 p-4">
			<section
				role="dialog"
				aria-modal="true"
				aria-labelledby="grade-lesson-edit-title"
				className="surface my-auto w-full max-w-xl overflow-hidden rounded-card shadow-card"
			>
				<header className="border-b border-line bg-brand-soft/40 px-6 py-5">
					<p className="text-xs font-semibold uppercase tracking-wide text-brand">
						Grade horária
					</p>
					<h2
						id="grade-lesson-edit-title"
						className="mt-1 text-xl font-semibold text-ink"
					>
						Editar horário
					</h2>
					<p className="mt-1 text-sm text-ink-muted">{disciplineName}</p>
					{isLoading && (
						<p className="mt-3 text-sm text-ink-muted" role="status">
							Carregando os dados atuais do horário...
						</p>
					)}
				</header>

				<form className="flex flex-col gap-5 p-6" onSubmit={handleSubmit}>
					<label className="flex flex-col gap-1 text-sm font-medium text-ink-muted">
						Dia da semana
						<select
							className="form-input"
							value={diaSemana}
							onChange={(event) => setDiaSemana(event.currentTarget.value)}
							disabled={isSaving || isLoading}
							required
						>
							{weekdays.map((weekday) => (
								<option key={weekday.value} value={weekday.value}>
									{weekday.label}
								</option>
							))}
						</select>
					</label>

					<fieldset className="rounded-control border border-line p-4">
						<legend className="px-1 text-sm font-medium text-ink-muted">
							Intervalo da aula
						</legend>
						<div className="grid gap-3 sm:grid-cols-2">
							<label className="flex flex-col gap-1 text-sm font-medium text-ink-muted">
								Início
								<input
									className="form-input"
									type="time"
									value={horaInicio}
									onChange={(event) =>
										setHoraInicio(event.currentTarget.value)
									}
									disabled={isSaving || isLoading}
									required
								/>
							</label>
							<label className="flex flex-col gap-1 text-sm font-medium text-ink-muted">
								Fim
								<input
									className="form-input"
									type="time"
									value={horaFim}
									onChange={(event) => setHoraFim(event.currentTarget.value)}
									disabled={isSaving || isLoading}
									required
								/>
							</label>
						</div>
					</fieldset>

					{(validationError || errorMessage) && (
						<p className="text-sm text-danger-fg" role="alert">
							{validationError || errorMessage}
						</p>
					)}

					<footer className="flex justify-end gap-2 border-t border-line pt-4">
						<button
							type="button"
							className="btn"
							data-variant="secondary"
							onClick={onCancel}
							disabled={isSaving}
						>
							Cancelar
						</button>
						<button type="submit" className="btn" disabled={isSaving || isLoading}>
							{isLoading
								? "Carregando..."
								: isSaving
									? "Salvando..."
									: "Salvar horário"}
						</button>
					</footer>
				</form>
			</section>
		</div>
	);
}
