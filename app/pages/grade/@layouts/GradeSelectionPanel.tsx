import { Link } from "react-router";
import type { GradePageSelection } from "../@hooks/useGradePage";
import { academicKey, periodLabel } from "../grade-page.utils";

/** Renders professor search and the period/grade selectors. */
export default function GradeSelectionPanel({
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
	onProfessorQueryChange,
	onProfessorFocus,
	onProfessorBlur,
	onSelectProfessor,
	onPeriodChange,
	onGradeChange,
}: GradePageSelection) {
	return (
		<section className="surface rounded-card border border-line p-5">
			<h2 className="font-semibold text-ink">Selecione os dados da grade</h2>
			<p className="mt-1 text-sm text-ink-muted">
				Ao escolher um professor, a grade mais recente é carregada
				automaticamente.
			</p>

			<div className="mt-4 grid gap-3 md:grid-cols-3">
				<div className="relative flex flex-col gap-1 text-xs font-medium text-ink-muted">
					Professor
					<input
						className="form-input w-full"
						type="text"
						autoComplete="off"
						placeholder="Digite o nome do professor"
						value={professorQuery}
						aria-expanded={showProfessorSuggestions}
						aria-controls="grade-professor-results"
						onFocus={onProfessorFocus}
						onBlur={onProfessorBlur}
						onChange={(event) =>
							onProfessorQueryChange(event.currentTarget.value)
						}
					/>
					{showProfessorSuggestions && (
						<div
							id="grade-professor-results"
							className="absolute inset-x-0 top-full z-20 mt-1 overflow-hidden rounded-control border border-line bg-surface shadow-lg"
						>
							{matchingProfessors.slice(0, 5).map((entry) => (
								<button
									key={entry.id}
									type="button"
									className="block w-full border-b border-line px-3 py-2 text-left text-sm text-ink last:border-b-0 hover:bg-brand-soft focus:bg-brand-soft"
									onMouseDown={(event) => event.preventDefault()}
									onClick={() => onSelectProfessor(entry)}
								>
									{entry.name}
								</button>
							))}
							{matchingProfessors.length > 5 && (
								<p className="border-t border-line bg-surface-sunken px-3 py-2 text-xs text-ink-muted">
									Exibindo 5 de {matchingProfessors.length} professores.
									Refine a busca.
								</p>
							)}
							{!matchingProfessors.length && (
								<p className="px-3 py-2 text-sm text-ink-muted">
									Nenhum professor encontrado.
								</p>
							)}
						</div>
					)}
				</div>

				<label className="flex flex-col gap-1 text-xs font-medium text-ink-muted">
					Período letivo
					<select
						className="form-input w-full"
						value={periodId}
						onChange={(event) => onPeriodChange(event.currentTarget.value)}
						disabled={!periodos.length}
					>
						<option value="">Selecione...</option>
						{[...periodos]
							.sort((a, b) => academicKey(b) - academicKey(a))
							.map((period) => (
								<option key={period.id} value={period.id}>
									{periodLabel(period)}
								</option>
							))}
					</select>
				</label>

				<label className="flex flex-col gap-1 text-xs font-medium text-ink-muted">
					Grade
					<select
						className="form-input w-full"
						value={gradeId}
						onChange={(event) => onGradeChange(event.currentTarget.value)}
						disabled={!gradesForPeriod.length || loadingGrades}
					>
						<option value="">
							{loadingGrades ? "Carregando..." : "Selecione..."}
						</option>
						{gradesForPeriod.map((grade, index) => (
							<option key={grade.id} value={grade.id}>
								{index + 1}ª Grade — {periodLabel(selectedPeriod)}
							</option>
						))}
					</select>
				</label>
			</div>

			{professor && (
				<dl className="mt-5 grid gap-x-6 gap-y-4 border-t border-line pt-4 sm:grid-cols-2 lg:grid-cols-4">
					<ProfileField label="Professor" value={professor.name} />
					<ProfileField label="Titulação" value={professor.title} />
					<ProfileField label="Situação" value={professor.status} />
					<ProfileField
						label="Período selecionado"
						value={periodLabel(selectedPeriod)}
					/>
					<ProfileField
						label="Carga semanal cadastrada"
						value={selectedGrade ? `${selectedGrade.semanal}h` : "—"}
					/>
				</dl>
			)}

			{!professor && (
				<p className="mt-4 rounded-control bg-surface-sunken p-3 text-sm text-ink-muted">
					{professorNotFound
						? "Professor não encontrado. Confira o nome ou cadastre o professor para continuar."
						: "Pesquise e selecione um professor cadastrado para consultar a grade."}
				</p>
			)}
			{professorNotFound && (
				<Link
					className="btn mt-3"
					data-variant="outline"
					to="/professor/add"
				>
					Cadastrar professor
				</Link>
			)}
			{gradesError && (
				<p className="mt-3 text-sm text-danger-fg" role="alert">
					Não foi possível carregar as grades: {gradesError}
				</p>
			)}
			{professor && !loadingGrades && !gradesError && (
				<div className="mt-3 flex flex-wrap items-center justify-between gap-3">
					<p className="text-sm text-ink-muted">
						{gradesForPeriod.length
							? `${gradesForPeriod.length} grade(s) encontrada(s) neste período.`
							: `Este professor ainda não possui grade em ${periodLabel(selectedPeriod)}.`}
					</p>
					<Link
						className="btn"
						to={`/professor/${professor.id}/grades/new`}
					>
						{gradesForPeriod.length
							? "Cadastrar outra grade"
							: "Cadastrar grade"}
					</Link>
				</div>
			)}
		</section>
	);
}

/** Displays a label and a value in the professor summary. */
function ProfileField({ label, value }: { label: string; value?: string }) {
	return (
		<div>
			<dt className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
				{label}
			</dt>
			<dd className="mt-1 text-sm font-medium text-ink">{value || "—"}</dd>
		</div>
	);
}
