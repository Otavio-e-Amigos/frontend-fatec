import { useState } from "react";
import { Link } from "react-router";
import type Curso from "~/modules/curso/curso.class";
import formatTurno from "~/modules/curso/format-turno";
import type Disciplina from "~/modules/disciplina/disciplina.class";
import type PeriodoLetivo from "~/modules/periodo-letivo/periodo-letivo.class";
import type Professor from "~/modules/professor/professor.class";
import Grade from "~/modules/grade/grade.class";
import {
	itemColors,
	shifts,
} from "./grade-wizard.utils";

type GradeWizardDisciplineStepProps = {
	professor: Professor;
	cursos: Curso[];
	disciplinas: Disciplina[];
	periodos: PeriodoLetivo[];
	opOptions: number[];
	opOptionsError?: string;
	periodoId: string;
	onPeriodChange: (periodId: string) => void;
	items: Grade[];
	onItemAdded: (item: Grade) => void;
	onRemoveItem: (key: string) => void;
	itemError: string;
	onItemError: (message: string) => void;
	hasPersistedData: boolean;
};

/** Collects discipline details and displays the disciplines already added. */
export default function GradeWizardDisciplineStep({
	professor,
	cursos,
	disciplinas,
	periodos,
	opOptions,
	opOptionsError,
	periodoId,
	onPeriodChange,
	items,
	onItemAdded,
	onRemoveItem,
	itemError,
	onItemError,
	hasPersistedData,
}: GradeWizardDisciplineStepProps) {
	const [disciplinaQuery, setDisciplinaQuery] = useState("");
	const [showDisciplineSuggestions, setShowDisciplineSuggestions] =
		useState(false);
	const [cursoId, setCursoId] = useState("");
	const [semestreCurso, setSemestreCurso] = useState("1");
	const [quantidadeAulas, setQuantidadeAulas] = useState("1");
	const [op, setOp] = useState("");
	const [courseFilter, setCourseFilter] = useState("");
	const [shiftFilter, setShiftFilter] = useState("");

	const selectedPeriod = periodos.find(
		(item) => String(item.id) === periodoId,
	);
	const selectedCourse = cursos.find((item) => String(item.id) === cursoId);
	const matchingDisciplines = disciplinas.filter((discipline) =>
		discipline.nome
			?.toLocaleLowerCase("pt-BR")
			.includes(disciplinaQuery.trim().toLocaleLowerCase("pt-BR")),
	);
	const visibleItems = items.filter(
		(item) =>
			(!courseFilter || String(item.cursoId) === courseFilter) &&
			(!shiftFilter || item.periodo === shiftFilter),
	);

	/** Validates the form and appends a new discipline to the grade. */
	function addItem() {
		const selectedDiscipline = disciplinas.find(
			(item) =>
				item.nome?.trim().toLocaleLowerCase("pt-BR") ===
				disciplinaQuery.trim().toLocaleLowerCase("pt-BR"),
		);
		const course = cursos.find((item) => String(item.id) === cursoId);
		const lessonsPerWeek = Number(quantidadeAulas);
		const optionalValue = op.trim() ? Number(op) : null;

		if (!selectedPeriod) {
			onItemError("Selecione o período letivo da grade.");
			return;
		}
		if (!selectedDiscipline?.id || !course?.id) {
			onItemError("Selecione uma disciplina e um curso cadastrados.");
			return;
		}
		if (!Number.isInteger(lessonsPerWeek) || lessonsPerWeek < 1) {
			onItemError("Informe pelo menos uma aula por semana.");
			return;
		}
		if (
			!Number.isInteger(Number(semestreCurso)) ||
			Number(semestreCurso) < 1 ||
			Number(semestreCurso) > 12
		) {
			onItemError("Informe um semestre do curso entre 1 e 12.");
			return;
		}
		if (
			optionalValue !== null &&
			(!Number.isInteger(optionalValue) ||
				optionalValue < 0 ||
				optionalValue > 999)
		) {
			onItemError("O campo OP aceita um número inteiro de 0 a 999.");
			return;
		}

		const shift = course.turno || "";
		if (!shifts.some((item) => item.value === shift)) {
			onItemError("Selecione um turno válido para a disciplina.");
			return;
		}

		const newItem = new Grade({
			key: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
			disciplinaId: selectedDiscipline.id,
			disciplina: selectedDiscipline.nome ?? "Disciplina",
			cursoId: course.id,
			curso: course.nome ?? "Curso",
			semestreCurso: Number(semestreCurso),
			periodo: shift,
			quantidadeAulas: lessonsPerWeek,
			op: optionalValue,
			status: "MINISTRANDO",
			aulas: [],
		});

		onItemAdded(newItem);
		setDisciplinaQuery("");
		setShowDisciplineSuggestions(false);
		setOp("");
		onItemError("");
	}

	return (
		<section className="surface flex flex-col gap-5 rounded-card p-5">
			<header className="flex flex-wrap items-start justify-between gap-2 border-b border-line pb-3">
				<div>
					<h1 className="text-lg font-semibold text-accent">
						Minhas Disciplinas
					</h1>
					<p className="mt-1 text-sm text-ink-muted">
						Professor: {professor.name}
					</p>
				</div>
				<p className="text-sm text-ink-muted">
					{items.length} disciplina(s) adicionada(s)
				</p>
			</header>

			{!periodos.length && (
				<p className="rounded-control border border-warn-dot/30 bg-warn-bg p-3 text-sm text-warn-fg">
					Nenhum período letivo está cadastrado.{" "}
					<Link className="font-semibold underline" to="/periodo-letivo/add">
						Cadastre um período letivo
					</Link>{" "}
					antes de montar a grade.
				</p>
			)}
			{(!cursos.length || !disciplinas.length) && (
				<p className="rounded-control border border-warn-dot/30 bg-warn-bg p-3 text-sm text-warn-fg">
					{!cursos.length && !disciplinas.length
						? "Não há cursos nem disciplinas cadastrados."
						: !cursos.length
							? "Não há cursos cadastrados."
							: "Não há disciplinas cadastradas."}{" "}
					Cadastre os dados antes de montar a grade.
				</p>
			)}

			<div className="rounded-control border border-line bg-surface-sunken p-4">
				<p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">
					Adicionar disciplina
				</p>
				<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
					<label className="flex flex-col gap-1 text-xs font-medium text-ink-muted">
						Período letivo
						<select
							className="form-input w-full"
							value={periodoId}
							onChange={(event) => onPeriodChange(event.currentTarget.value)}
							disabled={hasPersistedData}
						>
							<option value="">Selecione...</option>
							{periodos.map((periodo) => (
								<option key={periodo.id} value={periodo.id}>
									{periodo.ano}/{periodo.semestre}
								</option>
							))}
						</select>
					</label>
					<div className="relative flex flex-col gap-1 text-xs font-medium text-ink-muted">
						Disciplina
						<input
							className="form-input w-full"
							type="text"
							autoComplete="off"
							placeholder="Digite para pesquisar"
							value={disciplinaQuery}
							aria-expanded={showDisciplineSuggestions}
							aria-controls="grade-discipline-results"
							onFocus={() => setShowDisciplineSuggestions(true)}
							onBlur={() =>
								window.setTimeout(
									() => setShowDisciplineSuggestions(false),
									120,
								)
							}
							onChange={(event) => {
								setDisciplinaQuery(event.currentTarget.value);
								setShowDisciplineSuggestions(true);
							}}
							disabled={hasPersistedData}
						/>
						{showDisciplineSuggestions && !hasPersistedData && (
							<div
								id="grade-discipline-results"
								className="absolute inset-x-0 top-full z-20 mt-1 overflow-hidden rounded-control border border-line bg-surface shadow-lg"
							>
								{matchingDisciplines.slice(0, 5).map((discipline) => (
									<button
										key={discipline.id}
										type="button"
										className="block w-full border-b border-line px-3 py-2 text-left text-sm text-ink last:border-b-0 hover:bg-brand-soft focus:bg-brand-soft"
										onMouseDown={(event) => event.preventDefault()}
										onClick={() => {
											setDisciplinaQuery(discipline.nome ?? "");
											setShowDisciplineSuggestions(false);
										}}
									>
										{discipline.nome}
									</button>
								))}
								{matchingDisciplines.length > 5 && (
									<p className="border-t border-line bg-surface-sunken px-3 py-2 text-xs text-ink-muted">
										Exibindo 5 de {matchingDisciplines.length} disciplinas.
										Refine a busca.
									</p>
								)}
								{!matchingDisciplines.length && (
									<p className="px-3 py-2 text-sm text-ink-muted">
										Nenhuma disciplina encontrada.
									</p>
								)}
							</div>
						)}
						<span className="text-[11px] font-normal text-ink-muted">
							Escolha uma disciplina cadastrada para vinculá-la à grade.
						</span>
					</div>
					<label className="flex flex-col gap-1 text-xs font-medium text-ink-muted">
						Curso
						<select
							className="form-input w-full"
							value={cursoId}
							onChange={(event) => setCursoId(event.currentTarget.value)}
							disabled={hasPersistedData}
						>
							<option value="">Selecione...</option>
							{cursos.map((course) => (
								<option key={course.id} value={course.id}>
									{course.nome} ({formatTurno(course.turno ?? "")})
								</option>
							))}
						</select>
					</label>
					<label className="flex flex-col gap-1 text-xs font-medium text-ink-muted">
						Semestre do curso
						<input
							className="form-input w-full"
							type="number"
							min="1"
							max="12"
							step="1"
							value={semestreCurso}
							onChange={(event) => setSemestreCurso(event.currentTarget.value)}
							disabled={hasPersistedData}
						/>
					</label>
					<label className="flex flex-col gap-1 text-xs font-medium text-ink-muted">
						Turno do curso
						<div className="form-input flex items-center">
							{selectedCourse?.turno
								? formatTurno(selectedCourse.turno)
								: "Selecione um curso"}
						</div>
					</label>
					<label className="flex flex-col gap-1 text-xs font-medium text-ink-muted">
						Status
						<div className="form-input flex items-center">
							<span className="rounded-control bg-ok-bg px-2 py-1 text-xs font-semibold text-ok-fg">
								MINISTRANDO
							</span>
						</div>
					</label>
					<label className="flex flex-col gap-1 text-xs font-medium text-ink-muted">
						Aulas por semana
						<input
							className="form-input w-full"
							type="number"
							min="1"
							max="40"
							step="1"
							required
							value={quantidadeAulas}
							onChange={(event) => setQuantidadeAulas(event.currentTarget.value)}
							disabled={hasPersistedData}
						/>
					</label>
					<label className="flex flex-col gap-1 text-xs font-medium text-ink-muted">
						OP (opcional)
						<input
							className="form-input w-full"
							type="number"
							min="0"
							max="999"
							step="1"
							list="grade-op-options"
							placeholder="Digite ou selecione"
							value={op}
							onChange={(event) => setOp(event.currentTarget.value)}
							disabled={hasPersistedData}
						/>
						<datalist id="grade-op-options">
							{opOptions.map((option) => (
								<option key={option} value={option} />
							))}
						</datalist>
					</label>
					<div className="flex items-end">
						<button
							type="button"
							className="btn w-full"
							data-variant="outline"
							onClick={addItem}
							disabled={hasPersistedData}
						>
							+ Adicionar
						</button>
					</div>
				</div>
				{opOptionsError && (
					<p className="mt-3 text-xs text-hint-warning" role="status">
						Não foi possível carregar sugestões de OP: {opOptionsError} É
						possível digitar o valor manualmente.
					</p>
				)}
				{itemError && (
					<p className="mt-3 text-sm text-hint-warning" role="alert">
						{itemError}
					</p>
				)}
			</div>

			<div className="flex flex-wrap items-center justify-between gap-3">
				<div className="flex flex-wrap gap-2">
					<label className="flex items-center gap-2 text-xs text-ink-muted">
						Filtrar curso
						<select
							className="form-input"
							value={courseFilter}
							onChange={(event) => setCourseFilter(event.currentTarget.value)}
						>
							<option value="">Todos os cursos</option>
							{[
								...new Map(
									items.map((item) => [item.cursoId, item.curso]),
								).entries(),
							].map(([id, name]) => (
								<option key={id} value={id}>
									{name}
								</option>
							))}
						</select>
					</label>
					<label className="flex items-center gap-2 text-xs text-ink-muted">
						Filtrar turno
						<select
							className="form-input"
							value={shiftFilter}
							onChange={(event) => setShiftFilter(event.currentTarget.value)}
						>
							<option value="">Todos os turnos</option>
							{shifts.map((shift) => (
								<option key={shift.value} value={shift.value}>
									{shift.label}
								</option>
							))}
						</select>
					</label>
				</div>
				<span className="text-xs text-ink-muted">
					{visibleItems.length} disciplina(s)
				</span>
			</div>

			{items.length ? (
				<ul className="flex flex-col gap-2">
					{visibleItems.map((item) => {
						const color =
							itemColors[
								items.findIndex((entry) => entry.key === item.key) %
									itemColors.length
							];
						return (
							<li
								key={item.key}
								className="flex flex-wrap items-center gap-3 rounded-control border border-line px-3 py-2"
								style={{ borderLeftWidth: 3, borderLeftColor: color }}
							>
								<strong className="text-sm text-ink">{item.disciplina}</strong>
								<span className="text-xs text-ink-muted">{item.curso}</span>
								<span className="rounded-control bg-brand-soft px-2 py-1 text-xs text-brand">
									{formatTurno(item.periodo)}
								</span>
								<span className="rounded-control bg-ok-bg px-2 py-1 text-xs text-ok-fg">
									{item.status}
								</span>
								<span className="text-xs text-ink-muted">
									{item.quantidadeAulas} aula(s)/sem
								</span>
								<span className="text-xs text-ink-muted">
									{item.semestreCurso}º semestre
								</span>
								{item.op !== null && (
									<span className="text-xs text-ink-muted">OP {item.op}</span>
								)}
								<button
									type="button"
									className="ml-auto grid size-7 place-items-center rounded-control border border-line text-ink-muted hover:bg-danger-bg hover:text-danger-fg"
									aria-label={`Remover ${item.disciplina}`}
									onClick={() => onRemoveItem(item.key)}
									disabled={hasPersistedData}
								>
									×
								</button>
							</li>
						);
					})}
				</ul>
			) : (
				<p className="rounded-control border border-dashed border-line-strong px-4 py-8 text-center text-sm text-ink-muted">
					Adicione disciplinas para montar a grade horária.
				</p>
			)}
		</section>
	);
}
