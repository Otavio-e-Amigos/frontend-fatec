import type { GradePageFocus } from "../@hooks/useGradePage";
import GradeDisciplineCard from "./GradeDisciplineCard";
import GradeWeeklySchedule from "./GradeWeeklySchedule";

/** Presents the selected grade, its weekly view, and discipline cards. */
export default function GradeFocusPanel({
	grade,
	periodLabel,
	gradeNumber,
	schedule,
	loadingSchedule,
	scheduleError,
	isSavingEdit,
	isDeleting,
	onRetry,
	onEditGrade,
	onDeleteGrade,
	onEditDiscipline,
	onDeleteDiscipline,
	onEditLesson,
	onDeleteLesson,
}: GradePageFocus) {
	if (!grade) return null;

	return (
		<section className="overflow-hidden rounded-card border border-brand/40 bg-surface">
			<header className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-brand-soft/40 px-5 py-4">
				<div>
					<p className="text-xs font-semibold uppercase tracking-wide text-brand">
						Grade em foco
					</p>
					<h2 className="mt-1 font-semibold text-ink">{periodLabel}</h2>
					<p className="mt-1 text-sm text-ink-muted">
						Confira as aulas cadastradas para este professor.
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-2">
					<button
						type="button"
						className="btn"
						data-variant="outline"
						onClick={onEditGrade}
					>
						Editar grade
					</button>
					<button
						type="button"
						className="btn"
						data-variant="danger"
						onClick={onDeleteGrade}
						disabled={isDeleting}
					>
						Excluir grade
					</button>
					<span className="rounded-control border border-line bg-surface px-3 py-2 text-xs text-ink-muted">
						{gradeNumber}ª Grade
					</span>
				</div>
			</header>

			<div className="flex flex-col gap-4 p-5">
				{loadingSchedule && (
					<p className="text-sm text-ink-muted" role="status">
						Carregando disciplinas e horários...
					</p>
				)}
				{scheduleError && (
					<div
						className="flex flex-wrap items-center justify-between gap-3 rounded-control border border-danger-dot/30 bg-danger-bg p-3 text-sm text-danger-fg"
						role="alert"
					>
						<p>Não foi possível carregar os horários: {scheduleError}</p>
						<button
							className="btn"
							data-variant="outline"
							type="button"
							onClick={onRetry}
						>
							Tentar novamente
						</button>
					</div>
				)}
				{!loadingSchedule && !scheduleError && schedule.length > 0 && (
					<>
						<GradeWeeklySchedule schedule={schedule} />
						<div className="grid gap-3 sm:grid-cols-2">
							{schedule.map((discipline) => (
								<GradeDisciplineCard
									key={discipline.id}
									discipline={discipline}
									isSavingEdit={isSavingEdit}
									isDeleting={isDeleting}
									onEdit={onEditDiscipline}
									onCancelOrDelete={onDeleteDiscipline}
									onEditLesson={onEditLesson}
									onDeleteLesson={onDeleteLesson}
								/>
							))}
						</div>
					</>
				)}
				{!loadingSchedule && !scheduleError && schedule.length === 0 && (
					<p className="text-sm text-ink-muted">
						Esta grade ainda não possui disciplinas e horários cadastrados.
					</p>
				)}
			</div>
		</section>
	);
}
