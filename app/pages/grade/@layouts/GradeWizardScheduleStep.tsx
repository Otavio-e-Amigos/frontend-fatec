import formatTurno from "~/modules/curso/format-turno";
import type { GradeLessonPayload } from "~/modules/grade/grade.service";
import type Grade from "~/modules/grade/grade.class";
import {
	getAllocatedBlocks,
	itemColors,
	weekDays,
} from "./grade-wizard.utils";
import GradeWizardScheduleGrid from "./GradeWizardScheduleGrid";

type GradeWizardScheduleStepProps = {
	items: Grade[];
	selectedItemKey: string;
	selectedItem?: Grade;
	day: string;
	manualStart: string;
	manualEnd: string;
	scheduleError: string;
	hasPersistedData: boolean;
	onSelectItem: (key: string) => void;
	onDayChange: (day: string) => void;
	onManualStartChange: (time: string) => void;
	onManualEndChange: (time: string) => void;
	onAddManualLesson: () => void;
	onAddLesson: (itemKey: string, lesson: GradeLessonPayload) => void;
	onRemoveLesson: (itemKey: string, lesson: GradeLessonPayload) => void;
};

type ManualLessonFormProps = {
	items: Grade[];
	selectedItemKey: string;
	day: string;
	manualStart: string;
	manualEnd: string;
	hasPersistedData: boolean;
	onSelectItem: (key: string) => void;
	onDayChange: (day: string) => void;
	onManualStartChange: (time: string) => void;
	onManualEndChange: (time: string) => void;
	onAddManualLesson: () => void;
};

/** Renders the manual time controls and official weekly schedule grid. */
export default function GradeWizardScheduleStep({
	items,
	selectedItemKey,
	selectedItem,
	day,
	manualStart,
	manualEnd,
	scheduleError,
	hasPersistedData,
	onSelectItem,
	onDayChange,
	onManualStartChange,
	onManualEndChange,
	onAddManualLesson,
	onAddLesson,
	onRemoveLesson,
}: GradeWizardScheduleStepProps) {
	return (
		<section className="surface flex flex-col gap-4 rounded-card p-5">
			<header className="flex flex-wrap items-start justify-between gap-2 border-b border-line pb-3">
				<div>
					<h1 className="text-lg font-semibold text-brand">Grade Horária</h1>
					<p className="mt-1 text-sm text-ink-muted">
						Digite horários flexíveis manualmente ou selecione os blocos
						oficiais na grade. Cada bloco equivale a 50 minutos e intervalos
						não precisam ser cadastrados.
					</p>
				</div>
				<p className="text-sm text-ink-muted">
					{items.reduce((count, item) => count + getAllocatedBlocks(item), 0)}{" "}
					bloco(s) alocado(s)
				</p>
			</header>

			<ActiveDisciplineSelector
				items={items}
				selectedItemKey={selectedItemKey}
				onSelectItem={onSelectItem}
			/>
			<ManualLessonForm
				items={items}
				selectedItemKey={selectedItemKey}
				day={day}
				manualStart={manualStart}
				manualEnd={manualEnd}
				hasPersistedData={hasPersistedData}
				onSelectItem={onSelectItem}
				onDayChange={onDayChange}
				onManualStartChange={onManualStartChange}
				onManualEndChange={onManualEndChange}
				onAddManualLesson={onAddManualLesson}
			/>
			{selectedItem && (
				<p
					className="rounded-control border border-brand/20 bg-brand-soft/40 px-3 py-2 text-xs text-ink-muted"
					role="status"
				>
					{selectedItem.disciplina} só pode ser alocada no turno{" "}
					<strong className="text-brand">
						{formatTurno(selectedItem.periodo)}
					</strong>
					. Os demais turnos ficam bloqueados.
				</p>
			)}

			<GradeWizardScheduleGrid
				items={items}
				selectedItem={selectedItem}
				hasPersistedData={hasPersistedData}
				onAddLesson={onAddLesson}
				onRemoveLesson={onRemoveLesson}
			/>
			<ScheduledLessons
				items={items}
				hasPersistedData={hasPersistedData}
				onRemoveLesson={onRemoveLesson}
			/>

			{scheduleError && (
				<p className="text-sm text-hint-warning" role="alert">
					{scheduleError}
				</p>
			)}
		</section>
	);
}

/** Lets the user choose which discipline receives the next schedule entry. */
function ActiveDisciplineSelector({
	items,
	selectedItemKey,
	onSelectItem,
}: {
	items: Grade[];
	selectedItemKey: string;
	onSelectItem: (key: string) => void;
}) {
	return (
		<div className="flex flex-wrap items-center gap-2">
			<span className="text-xs font-medium text-ink-muted">
				Disciplina ativa:
			</span>
			{items.map((item, index) => {
				const color = itemColors[index % itemColors.length];
				return (
					<button
						key={item.key}
						type="button"
						className="rounded-control border px-2.5 py-1 text-xs"
						style={{
							borderColor: color,
							color,
							backgroundColor:
								selectedItemKey === item.key
									? `color-mix(in srgb, ${color} 12%, white)`
									: undefined,
						}}
						aria-pressed={selectedItemKey === item.key}
						onClick={() => onSelectItem(item.key)}
					>
						{item.disciplina} ({getAllocatedBlocks(item)}/
						{item.quantidadeAulas})
					</button>
				);
			})}
			<span className="ml-auto text-xs text-ink-muted">
				Selecione os intervalos disponíveis na grade para alocar aulas.
			</span>
		</div>
	);
}

/** Provides flexible controls to add a lesson without selecting a grid cell. */
function ManualLessonForm({
	items,
	selectedItemKey,
	day,
	manualStart,
	manualEnd,
	hasPersistedData,
	onSelectItem,
	onDayChange,
	onManualStartChange,
	onManualEndChange,
	onAddManualLesson,
}: ManualLessonFormProps) {
	return (
		<fieldset
			className="grid gap-3 rounded-control border border-line bg-surface-sunken p-4 sm:grid-cols-2 lg:grid-cols-5"
			disabled={hasPersistedData || !items.length}
		>
			<legend className="px-1 text-xs font-semibold text-ink-muted">
				Adicionar horário manualmente
			</legend>
			<label className="flex flex-col gap-1 text-xs font-medium text-ink-muted">
				Disciplina
				<select
					className="form-input"
					value={selectedItemKey}
					onChange={(event) => onSelectItem(event.currentTarget.value)}
				>
					{items.map((item) => (
						<option key={item.key} value={item.key}>
							{item.disciplina} — {formatTurno(item.periodo)}
						</option>
					))}
				</select>
			</label>
			<label className="flex flex-col gap-1 text-xs font-medium text-ink-muted">
				Dia
				<select
					className="form-input"
					value={day}
					onChange={(event) => onDayChange(event.currentTarget.value)}
				>
					{weekDays.map((weekday) => (
						<option key={weekday.value} value={weekday.value}>
							{weekday.label}
						</option>
					))}
				</select>
			</label>
			<label className="flex flex-col gap-1 text-xs font-medium text-ink-muted">
				Início da aula
				<input
					className="form-input"
					type="time"
					value={manualStart}
					onChange={(event) => onManualStartChange(event.currentTarget.value)}
					required
				/>
			</label>
			<label className="flex flex-col gap-1 text-xs font-medium text-ink-muted">
				Fim da aula
				<input
					className="form-input"
					type="time"
					value={manualEnd}
					onChange={(event) => onManualEndChange(event.currentTarget.value)}
					required
				/>
			</label>
			<div className="flex items-end">
				<button
					type="button"
					className="btn w-full"
					data-variant="outline"
					onClick={onAddManualLesson}
				>
					+ Adicionar horário
				</button>
			</div>
		</fieldset>
	);
}

/** Lists the exact manual and official times assigned to each discipline. */
function ScheduledLessons({
	items,
	hasPersistedData,
	onRemoveLesson,
}: {
	items: Grade[];
	hasPersistedData: boolean;
	onRemoveLesson: (itemKey: string, lesson: GradeLessonPayload) => void;
}) {
	if (!items.length) return null;

	return (
		<div className="overflow-x-auto rounded-control border border-line">
			<table className="w-full min-w-[620px] text-left text-sm">
				<thead className="bg-surface-sunken text-xs text-ink-muted">
					<tr>
						{["Disciplina", "Dia", "Horário", "Turno", "Ação"].map((heading) => (
							<th key={heading} className="px-3 py-2">
								{heading}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{items.flatMap((item) =>
						item.aulas.map((lesson) => (
							<tr
								key={`${item.key}-${lesson.diaSemana}-${lesson.horaInicio}`}
								className="border-t border-line"
							>
								<td className="px-3 py-2">{item.disciplina}</td>
								<td className="px-3 py-2">
									{
										weekDays.find(
											(weekday) => weekday.value === lesson.diaSemana,
										)?.label
									}
								</td>
								<td className="px-3 py-2">
									{lesson.horaInicio}–{lesson.horaFim}
								</td>
								<td className="px-3 py-2">{formatTurno(item.periodo)}</td>
								<td className="px-3 py-2">
									<button
										type="button"
										className="text-danger-fg hover:underline disabled:cursor-not-allowed disabled:opacity-50"
										aria-label={`Remover horário de ${item.disciplina}`}
										disabled={hasPersistedData}
										onClick={() => onRemoveLesson(item.key, lesson)}
									>
										Remover
									</button>
								</td>
							</tr>
						)),
					)}
				</tbody>
			</table>
		</div>
	);
}
