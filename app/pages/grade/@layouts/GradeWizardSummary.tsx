import type PeriodoLetivo from "~/modules/periodo-letivo/periodo-letivo.class";
import type Professor from "~/modules/professor/professor.class";
import formatTurno from "~/modules/curso/format-turno";
import type Grade from "~/modules/grade/grade.class";
import { formatHours, getItemsTotals, itemColors } from "./grade-wizard.utils";
import GenericFloor from "~/layouts/pages/GenericFloor";
import FloorHeader from "~/layouts/pages/FloorHeader";

type SummaryTotals = {
	lessons: number;
	weekly: number;
	monthly: number;
	activity: number;
	monthlyTotal: number;
	semester: number;
};

type GradeWizardSummaryProps = {
	items: Grade[];
	professor: Professor;
	selectedPeriod: PeriodoLetivo;
	months: number;
	totals: SummaryTotals;
	saveError: string;
	hasPersistedData: boolean;
};

/** Renders the hour totals and per-discipline breakdown before saving. */
export default function GradeWizardSummary({
	items,
	professor,
	selectedPeriod,
	months,
	totals,
	saveError,
	hasPersistedData,
}: GradeWizardSummaryProps) {
	return (
		<GenericFloor
			className="flex flex-col gap-5 p-5"
			header={<div className="mx-4 my-3 flex flex-row">
				<FloorHeader title={"Resumo de Horas"} description={`Período ${selectedPeriod.ano}/${selectedPeriod.semestre}`} className="w-1/4" />
				<p className="w-3/4 text-right text-sm text-text-muted">Professor: {professor.name}</p>
			</div>}
		>
			{/*<header className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
				<div>
					<h1 className="text-lg font-semibold text-brand"></h1>
					<p className="mt-1 text-sm text-text-muted">

					</p>
				</div>

			</header>*/}

			<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
				<SummaryCard
					label="Aulas por semana"
					value={String(totals.lessons)}
					detail={formatHours(totals.weekly)}
					tone="brand"
				/>
				<SummaryCard
					label="Hora-aula mensal"
					value={formatHours(totals.monthly)}
					detail="4 semanas × horas semanais"
					tone="warn"
				/>
				<SummaryCard
					label="Hora atividade (50%)"
					value={formatHours(totals.activity)}
					detail="50% da hora-aula mensal"
					tone="warn"
				/>
				<SummaryCard
					label="Total semestral"
					value={formatHours(totals.semester)}
					detail={`${months} meses × ${formatHours(totals.monthlyTotal)}/mês`}
					tone="brand"
				/>
			</div>

			<div className="flex flex-col gap-2">
				<div className="flex flex-wrap items-center justify-between gap-2">
					<h2 className="font-semibold text-text">
						Detalhamento por disciplina
					</h2>
					<span className="text-xs text-text-muted">
						Período {selectedPeriod.ano}/{selectedPeriod.semestre}
					</span>
				</div>
				<div className="overflow-x-auto rounded-control border border-page-floor-outline">
					<table className="w-full min-w-[1050px] border-collapse text-left text-xs">
						<thead className="bg-page-floor-accent text-text-muted">
							<tr>
								{[
									"Disciplina",
									"Curso",
									"Semestre",
									"Turno",
									"Aulas/sem",
									"H. aula sem.",
									"H. aula mês",
									"H. atividade",
									"Total mensal",
									"Total semestral",
								].map((heading) => (
									<th
										key={heading}
										className="whitespace-nowrap border-b border-line px-3 py-3"
									>
										{heading}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{items.map((item, index) => {
								const itemTotals = getItemsTotals(item, months);
								const color = itemColors[index % itemColors.length];
								return (
									<tr key={item.key} className="border-t border-line">
										<td
											className="whitespace-nowrap px-3 py-3 font-medium"
											style={{ color }}
										>
											{item.disciplina}
										</td>
										<td className="px-3 py-3 text-text-muted">{item.curso}</td>
										<td className="px-3 py-3">{item.semestreCurso}º</td>
										<td className="px-3 py-3">{formatTurno(item.periodo)}</td>
										<td className="px-3 py-3">{item.quantidadeAulas}</td>
										<td className="px-3 py-3">
											{formatHours(itemTotals.weekly)}
										</td>
										<td className="px-3 py-3">
											{formatHours(itemTotals.monthly)}
										</td>
										<td className="px-3 py-3 text-warn-fg">
											{formatHours(itemTotals.activity)}
										</td>
										<td className="px-3 py-3 font-semibold text-brand">
											{formatHours(itemTotals.monthlyTotal)}
										</td>
										<td className="px-3 py-3 font-semibold text-warn-fg">
											{formatHours(itemTotals.semester)}
										</td>
									</tr>
								);
							})}
						</tbody>
						<tfoot className="bg-page-floor-accent font-semibold text-text">
							<tr>
								<td className="px-3 py-3" colSpan={4}>
									Total geral · {items.length} disciplina(s)
								</td>
								<td className="px-3 py-3">{totals.lessons}</td>
								<td className="px-3 py-3">{formatHours(totals.weekly)}</td>
								<td className="px-3 py-3">{formatHours(totals.monthly)}</td>
								<td className="px-3 py-3">{formatHours(totals.activity)}</td>
								<td className="px-3 py-3 text-brand">
									{formatHours(totals.monthlyTotal)}
								</td>
								<td className="px-3 py-3 text-hint-alert-fg">
									{formatHours(totals.semester)}
								</td>
							</tr>
						</tfoot>
					</table>
				</div>
				<p className="rounded-control border border-page-floor-outline bg-page-floor-accent p-3 text-xs leading-relaxed text-text-muted">
					Cálculo: cada aula equivale a 50 minutos; hora-aula mensal = horas
					semanais × 4 semanas; hora atividade = 50% da hora-aula mensal; total
					mensal = hora-aula mensal + hora atividade; total semestral = total
					mensal × {months} meses.
				</p>
			</div>

			{saveError && (
				<div
					className="rounded-control border border-hint-alert-dot/30 bg-hint-alert p-3 text-sm text-hint-alert-fg"
					role="alert"
				>
					<p className="font-semibold">
						Não foi possível concluir o salvamento.
					</p>
					<p className="mt-1">{saveError}</p>
					{hasPersistedData && (
						<p className="mt-1 text-xs">
							A grade já foi criada parcialmente. Corrija o problema e use
							“Continuar salvamento” para retomar sem duplicar os registros já
							gravados.
						</p>
					)}
				</div>
			)}
		</GenericFloor>
	);
}

/** Displays a single metric in the summary dashboard. */
function SummaryCard({
	label,
	value,
	detail,
	tone,
}: {
	label: string;
	value: string;
	detail: string;
	tone: "brand" | "warn";
}) {
	const styles = {
		brand: "border-page-floor-outline bg-page-floor-accent text-text",
		warn: "border-hint-alert-dot/30 bg-hint-alert text-hint-alert-fg",
	};

	return (
		<div
			className={`flex min-h-24 flex-col justify-between rounded-card border p-3 ${styles[tone]}`}
		>
			<p className="text-xs font-medium">{label}</p>
			<p className="text-2xl font-bold">{value}</p>
			<p className="text-[11px] opacity-80">{detail}</p>
		</div>
	);
}
