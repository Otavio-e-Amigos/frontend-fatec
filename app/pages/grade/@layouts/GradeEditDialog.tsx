import { useState, type FormEvent } from "react";
import type PeriodoLetivo from "~/modules/periodo-letivo/periodo-letivo.class";
import type {
	GradeCreatePayload,
	SavedGrade,
} from "~/modules/grade/grade.service";

type GradeEditDialogProps = {
	grade: SavedGrade;
	professorName: string;
	periodos: PeriodoLetivo[];
	isSaving: boolean;
	errorMessage: string;
	onSave: (payload: GradeCreatePayload) => Promise<void>;
	onCancel: () => void;
};

/** Edits a grade's academic period and persisted hour totals. */
export default function GradeEditDialog({
	grade,
	professorName,
	periodos,
	isSaving,
	errorMessage,
	onSave,
	onCancel,
}: GradeEditDialogProps) {
	const [periodoLetivoId, setPeriodoLetivoId] = useState(
		String(grade.periodoLetivoId),
	);
	const [semanal, setSemanal] = useState(String(grade.semanal));
	const [mensal, setMensal] = useState(String(grade.mensal));
	const [total, setTotal] = useState(String(grade.total));

	/** Validates the editable values and sends the grade update. */
	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const parsedPeriodId = Number(periodoLetivoId);
		const weeklyHours = Number(semanal);
		const monthlyHours = Number(mensal);
		const totalHours = Number(total);

		if (
			!Number.isSafeInteger(parsedPeriodId) ||
			parsedPeriodId < 1 ||
			![weeklyHours, monthlyHours, totalHours].every(
				(value) => Number.isFinite(value) && value >= 0,
			)
		) {
			return;
		}

		await onSave({
			professorId: grade.professorId,
			periodoLetivoId: parsedPeriodId,
			semanal: weeklyHours,
			mensal: monthlyHours,
			total: totalHours,
		});
	}

	return (
		<div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/50 p-4">
			<section
				role="dialog"
				aria-modal="true"
				aria-labelledby="grade-edit-title"
				className="surface my-auto w-full max-w-xl rounded-card p-6 shadow-card"
			>
				<header className="mb-5 border-b border-line pb-3">
					<h2
						id="grade-edit-title"
						className="text-xl font-semibold text-brand"
					>
						Editar grade
					</h2>
					<p className="mt-1 text-sm text-ink-muted">
						Atualize o período letivo e as cargas horárias registradas.
					</p>
				</header>

				<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
					<label className="flex flex-col gap-1 text-sm font-medium text-ink-muted">
						Professor
						<input
							className="form-input"
							value={professorName}
							readOnly
							aria-readonly="true"
						/>
					</label>
					<label className="flex flex-col gap-1 text-sm font-medium text-ink-muted">
						Período letivo
						<select
							className="form-input"
							value={periodoLetivoId}
							onChange={(event) =>
								setPeriodoLetivoId(event.currentTarget.value)
							}
							required
						>
							<option value="">Selecione...</option>
							{periodos.map((periodo) => (
								<option key={periodo.id} value={periodo.id}>
									{periodo.semestre}º semestre de {periodo.ano}
								</option>
							))}
						</select>
					</label>

					<div className="grid gap-3 sm:grid-cols-3">
						<HourField
							label="Horas semanais"
							value={semanal}
							onChange={setSemanal}
						/>
						<HourField
							label="Horas mensais"
							value={mensal}
							onChange={setMensal}
						/>
						<HourField
							label="Total da grade"
							value={total}
							onChange={setTotal}
						/>
					</div>
					<p className="text-xs leading-relaxed text-ink-muted">
						Esses totais são informações próprias da grade. Alterá-los não
						modifica automaticamente a carga horária de cada disciplina.
					</p>

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

/** Renders a non-negative decimal hour field. */
function HourField({
	label,
	value,
	onChange,
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
}) {
	return (
		<label className="flex flex-col gap-1 text-xs font-medium text-ink-muted">
			{label}
			<input
				className="form-input min-w-0"
				type="number"
				min="0"
				step="0.01"
				value={value}
				onChange={(event) => onChange(event.currentTarget.value)}
				required
			/>
		</label>
	);
}
