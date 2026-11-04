import { useMemo } from "react";
import GenericFloor from "~/layouts/pages/GenericFloor";
import type FolhaPontoPreviewData from "~/modules/folha-ponto/folha-ponto.class";
import {
	FREQUENCY_COLUMNS,
	SHIFTS,
	WEEKDAYS,
	buildScheduleCells,
	cellKey,
} from "../folha-ponto-page.utils";

type FolhaPontoPreviewProps = {
	data: FolhaPontoPreviewData;
	downloading: boolean;
	onDownload: () => void;
};

const cell = "border border-line px-1 py-0.5 text-center";

/** Prévia da folha: cabeçalho do professor, grade horária e frequência do mês. */
export default function FolhaPontoPreview({
	data,
	downloading,
	onDownload,
}: FolhaPontoPreviewProps) {
	const cells = useMemo(
		() => buildScheduleCells(data.gradeHoraria),
		[data.gradeHoraria],
	);
	const { professor } = data;

	return (
		<GenericFloor
			className="flex flex-col gap-5 p-5"
			header={
				<div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
					<div>
						<p className="text-xs font-semibold uppercase tracking-wide text-brand">
							Prévia
						</p>
						<h2 className="font-semibold text-ink">{data.titulo}</h2>
					</div>
					<button
						type="button"
						className="btn"
						disabled={downloading}
						onClick={onDownload}
					>
						{downloading ? "Gerando documento..." : "Baixar DOCX"}
					</button>
				</div>
			}
		>
			{/* Cabeçalho */}
			<dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
				<Field label="Professor" value={professor.nome} />
				<Field label="Código" value={professor.codigo} />
				<Field label="Matrícula" value={professor.matricula} />
				<Field
					label="Regime jurídico / contrato"
					value={[professor.regimeJuridico, professor.regimeContrato]
						.filter(Boolean)
						.join(" / ")}
				/>
			</dl>

			{/* Avisos do calendário acadêmico */}
			{data.avisos.length > 0 && (
				<ul className="list-disc rounded-control bg-brand-soft p-3 pl-7 text-sm text-ink">
					{data.avisos.map((aviso) => (
						<li key={aviso}>{aviso}</li>
					))}
				</ul>
			)}

			{/* Grade horária */}
			<section>
				<h3 className="mb-2 text-sm font-semibold text-ink">Grade horária</h3>
				<div className="overflow-x-auto">
					<table className="w-full border-collapse text-[11px]">
						<thead className="bg-surface-sunken">
							<tr>
								<th className={cell} rowSpan={2} />
								{SHIFTS.map((shift) => (
									<th
										key={shift.turno}
										className={cell}
										colSpan={shift.starts.length}
									>
										{shift.label}
									</th>
								))}
							</tr>
							<tr>
								{SHIFTS.flatMap((shift) =>
									shift.starts.map((start, index) => (
										<th key={`${shift.turno}-${index}`} className={cell}>
											{index + 1}º
											<br />
											<span className="font-normal text-ink-muted">
												{start}
											</span>
										</th>
									)),
								)}
							</tr>
						</thead>
						<tbody>
							{WEEKDAYS.map((weekday) => (
								<tr key={weekday.value}>
									<th className={`${cell} bg-surface-sunken`}>
										{weekday.label}
									</th>
									{SHIFTS.flatMap((shift) =>
										shift.starts.map((_, index) => (
											<td
												key={`${shift.turno}-${index}`}
												className={`${cell} font-medium`}
											>
												{cells.get(
													cellKey(weekday.value, shift.turno, index + 1),
												)}
											</td>
										)),
									)}
								</tr>
							))}
						</tbody>
					</table>
				</div>
				{data.gradeHoraria.length === 0 && (
					<p className="mt-2 text-sm text-ink-muted">
						A grade não possui aulas de segunda a sábado.
					</p>
				)}
			</section>

			{/* Frequência mensal */}
			<section>
				<h3 className="mb-2 text-sm font-semibold text-ink">
					Frequência mensal
				</h3>
				<div className="overflow-x-auto">
					<table className="w-full border-collapse text-[11px]">
						<thead className="bg-surface-sunken">
							<tr>
								<th className={cell} rowSpan={2}>
									Dia
								</th>
								<th className={cell} rowSpan={2}>
									Semana
								</th>
								{SHIFTS.map((shift) => (
									<th
										key={shift.turno}
										className={cell}
										colSpan={shift.starts.length + 1}
									>
										{shift.label}
									</th>
								))}
							</tr>
							<tr>
								{SHIFTS.flatMap((shift) => [
									<th key={`${shift.turno}-sign`} className={cell}>
										Assinatura
									</th>,
									...shift.starts.map((_, index) => (
										<th key={`${shift.turno}-${index}`} className={cell}>
											{index + 1}º
										</th>
									)),
								])}
							</tr>
						</thead>
						<tbody>
							{data.dias.map((dia) => {
								const noClass = dia.semAula && !dia.domingo;
								return (
									<tr
										key={dia.dia}
										className={
											dia.domingo ? "bg-line" : noClass ? "bg-brand-soft" : ""
										}
									>
										<td className={`${cell} font-semibold`}>
											{String(dia.dia).padStart(2, "0")}
										</td>
										<td className={cell}>{dia.diaSemana}</td>
										{noClass ? (
											<td
												colSpan={FREQUENCY_COLUMNS}
												className={`${cell} text-left text-ink-muted`}
											>
												{dia.motivo || "Sem aula"}
											</td>
										) : (
											Array.from({ length: FREQUENCY_COLUMNS }, (_, index) => (
												<td key={index} className={cell} />
											))
										)}
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</section>
		</GenericFloor>
	);
}

function Field({ label, value }: { label: string; value?: string }) {
	return (
		<div>
			<dt className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
				{label}
			</dt>
			<dd className="mt-1 text-sm font-medium text-ink">{value || "—"}</dd>
		</div>
	);
}