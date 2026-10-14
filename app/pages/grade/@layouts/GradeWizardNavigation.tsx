import { Link } from "react-router";

type GradeWizardNavigationProps = {
	step: number;
	professorId?: number;
	isSaving: boolean;
	hasPersistedData: boolean;
	onBack: () => void;
	onNext: () => void;
	onSave: () => void;
};

/** Renders the wizard progress indicator and its step navigation actions. */
export default function GradeWizardNavigation({
	step,
	professorId,
	isSaving,
	hasPersistedData,
	onBack,
	onNext,
	onSave,
}: GradeWizardNavigationProps) {
	return (
		<nav
			aria-label="Etapas da grade horária"
			className="surface flex flex-wrap items-center justify-between gap-3 rounded-card px-4 py-3"
		>
			<ol className="flex flex-wrap items-center gap-2 text-sm">
				{["Minhas disciplinas", "Grade horária", "Resumo de horas"].map(
					(label, index) => {
						const stepNumber = index + 1;
						const complete = step > stepNumber;
						const active = step === stepNumber;
						return (
							<li
								key={label}
								className="flex items-center gap-2"
								aria-current={active ? "step" : undefined}
							>
								<span
									className={`grid size-7 place-items-center rounded-full text-xs font-semibold ${
										complete
											? "bg-ok-bg text-ok-fg"
											: active
												? "bg-brand text-white"
												: "bg-surface-sunken text-ink-muted"
									}`}
								>
									{complete ? "✓" : stepNumber}
								</span>
								<span
									className={
										active ? "font-semibold text-ink" : "text-ink-muted"
									}
								>
									{label}
								</span>
								{index < 2 && (
									<span
										className="mx-1 h-px w-6 bg-line-strong"
										aria-hidden
									/>
								)}
							</li>
						);
					},
				)}
			</ol>
			<div className="flex gap-2">
				{step === 1 ? (
					<Link
						to={`/professor/${professorId}`}
						className="btn"
						data-variant="secondary"
					>
						Cancelar
					</Link>
				) : (
					<button
						type="button"
						className="btn"
						data-variant="secondary"
						onClick={onBack}
					>
						← Voltar
					</button>
				)}
				{step < 3 ? (
					<button type="button" className="btn" onClick={onNext}>
						Próximo →
					</button>
				) : (
					<button
						type="button"
						className="btn"
						onClick={onSave}
						disabled={isSaving}
					>
						{isSaving
							? "Salvando..."
							: hasPersistedData
								? "Continuar salvamento"
								: "Salvar grade"}
					</button>
				)}
			</div>
		</nav>
	);
}
