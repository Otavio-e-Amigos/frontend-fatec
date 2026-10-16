import formatTurno from "~/modules/curso/format-turno";
import type { SavedGradeLesson } from "~/modules/grade/grade.service";
import type { ScheduleDiscipline } from "../grade-page.types";
import { displayDay } from "../grade-page.utils";

type GradeDisciplineCardProps = {
	discipline: ScheduleDiscipline;
	isSavingEdit: boolean;
	isDeleting: boolean;
	onEdit: (discipline: ScheduleDiscipline) => void;
	onCancelOrDelete: (discipline: ScheduleDiscipline) => void;
	onEditLesson: (lesson: SavedGradeLesson) => void;
	onDeleteLesson: (
		discipline: ScheduleDiscipline,
		lesson: SavedGradeLesson,
	) => void;
};

/** Displays a discipline, its lessons, and the corresponding actions. */
export default function GradeDisciplineCard({
	discipline,
	isSavingEdit,
	isDeleting,
	onEdit,
	onCancelOrDelete,
	onEditLesson,
	onDeleteLesson,
}: GradeDisciplineCardProps) {
	const isCancelled = discipline.status === "CANCELADA";
	const canDeleteAssociation =
		isCancelled && discipline.lessons.length === 0;

	return (
		<article className="overflow-hidden rounded-card border border-line bg-surface">
			<div className="flex flex-col gap-4 p-4 sm:p-5">
				<header className="flex flex-wrap items-start justify-between gap-3">
					<div className="min-w-0">
						<p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
							{discipline.course} · {formatTurno(discipline.shift)}
						</p>
						<h3 className="mt-1 font-semibold text-ink">{discipline.name}</h3>
					</div>
					<span
						className={
							isCancelled
								? "rounded-control bg-warn-bg px-2.5 py-1 text-xs font-medium text-warn-fg"
								: "rounded-control bg-ok-bg px-2.5 py-1 text-xs font-medium text-ok-fg"
						}
					>
						{discipline.status}
					</span>
				</header>

				<section aria-label={`Horários de ${discipline.name}`}>
					<div className="mb-2 flex items-center justify-between gap-2">
						<h4 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
							Horários da disciplina
						</h4>
						<span className="text-xs text-ink-muted">
							{discipline.lessons.length} cadastrado(s)
						</span>
					</div>
					{discipline.lessons.length ? (
						<ul className="flex flex-col gap-2">
							{discipline.lessons.map((lesson) => (
								<LessonRow
									key={lesson.id}
									lesson={lesson}
									discipline={discipline}
									disabled={isSavingEdit || isDeleting}
									onEdit={() => onEditLesson(lesson)}
									onDelete={() => onDeleteLesson(discipline, lesson)}
								/>
							))}
						</ul>
					) : (
						<p className="rounded-control border border-dashed border-line px-3 py-4 text-sm text-ink-muted">
							Nenhum horário cadastrado para esta disciplina.
						</p>
					)}
				</section>

				<div className="flex flex-wrap items-center gap-2 border-t border-line pt-3 text-xs text-ink-muted">
					<InfoPill>{discipline.quantidadeAulas} aula(s)/semana</InfoPill>
					<InfoPill>{discipline.semestreCurso}º semestre</InfoPill>
					{discipline.op !== null && <InfoPill>OP {discipline.op}</InfoPill>}
				</div>

				<DisciplineStatusMessage
					isCancelled={isCancelled}
					hasLessons={discipline.lessons.length > 0}
				/>

				<footer className="flex flex-wrap justify-end gap-2 border-t border-line pt-3">
					<button
						type="button"
						className="btn"
						data-variant="outline"
						data-size="sm"
						onClick={() => onEdit(discipline)}
						disabled={isSavingEdit || isDeleting}
					>
						Editar disciplina
					</button>
					<button
						type="button"
						className="btn"
						data-variant="danger"
						data-size="sm"
						onClick={() => onCancelOrDelete(discipline)}
						disabled={
							isDeleting || (isCancelled && !canDeleteAssociation)
						}
						title={
							isCancelled && !canDeleteAssociation
								? "Exclua primeiro todos os horários desta disciplina."
								: undefined
						}
					>
						{isCancelled ? "Excluir vínculo" : "Desvincular"}
					</button>
				</footer>
			</div>
		</article>
	);
}

/** Displays one schedule entry with its own edit and delete actions. */
function LessonRow({
	lesson,
	discipline,
	disabled,
	onEdit,
	onDelete,
}: {
	lesson: SavedGradeLesson;
	discipline: ScheduleDiscipline;
	disabled: boolean;
	onEdit: () => void;
	onDelete: () => void;
}) {
	return (
		<li className="flex flex-col gap-3 rounded-control border border-line bg-surface-sunken/60 p-3 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex min-w-0 items-center gap-3">
				<span
					className="grid size-9 shrink-0 place-items-center rounded-control bg-brand-soft text-brand"
					aria-hidden="true"
				>
					<svg viewBox="0 0 20 20" fill="none" className="size-5">
						<circle
							cx="10"
							cy="10"
							r="7"
							stroke="currentColor"
							strokeWidth="1.5"
						/>
						<path
							d="M10 6v4l2.5 1.5"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
						/>
					</svg>
				</span>
				<div className="min-w-0">
					<p className="truncate text-sm font-medium text-ink">
						{displayDay(lesson.diaSemana)}
					</p>
					<p className="text-sm text-ink-muted">
						{lesson.horaInicio.slice(0, 5)}–{lesson.horaFim.slice(0, 5)}
					</p>
				</div>
			</div>
			<div className="flex shrink-0 gap-2 sm:justify-end">
				<button
					type="button"
					className="btn"
					data-variant="outline"
					data-size="sm"
					onClick={onEdit}
					disabled={disabled}
					aria-label={`Editar horário de ${displayDay(lesson.diaSemana)} ${lesson.horaInicio.slice(0, 5)} a ${lesson.horaFim.slice(0, 5)} de ${discipline.name}`}
				>
					Editar horário
				</button>
				<button
					type="button"
					className="btn"
					data-variant="danger"
					data-size="sm"
					onClick={onDelete}
					disabled={disabled}
					aria-label={`Excluir horário de ${displayDay(lesson.diaSemana)} ${lesson.horaInicio.slice(0, 5)} a ${lesson.horaFim.slice(0, 5)} de ${discipline.name}`}
				>
					Excluir horário
				</button>
			</div>
		</li>
	);
}

/** Displays the cancellation and deletion instructions for a discipline. */
function DisciplineStatusMessage({
	isCancelled,
	hasLessons,
}: {
	isCancelled: boolean;
	hasLessons: boolean;
}) {
	if (!isCancelled) {
		return (
			<p className="rounded-control border border-warn-fg/20 bg-warn-bg px-3 py-2 text-xs leading-relaxed text-warn-fg">
				“Desvincular” muda o status para CANCELADA. Depois, exclua os horários
				associados; quando não restar nenhum, esta ação muda para “Excluir
				vínculo”.
			</p>
		);
	}

	return (
		<p className="rounded-control border border-brand/20 bg-brand-soft/50 px-3 py-2 text-xs leading-relaxed text-ink-muted">
			{hasLessons
				? "Status CANCELADA. Exclua os horários acima para habilitar a exclusão definitiva do vínculo."
				: "Status CANCELADA e nenhum horário associado. O vínculo pode ser excluído definitivamente."}
		</p>
	);
}

/** Presents workload metadata in a consistent compact style. */
function InfoPill({ children }: { children: React.ReactNode }) {
	return (
		<span className="rounded-control bg-surface-sunken px-2.5 py-1">
			{children}
		</span>
	);
}
