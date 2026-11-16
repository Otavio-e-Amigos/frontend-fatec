import { PERIODOS, hojeISO } from "../relatorio-page.utils";
import type { RelatorioFiltrosState } from "../@hooks/useRelatorio";

/** Período, data (até hoje) e, nas folhas de ponto, o professor. */
export default function RelatorioFiltros({
	tipo,
	periodo,
	data,
	professorId,
	professores,
	loading,
	onPeriodoChange,
	onDataChange,
	onProfessorChange,
	onGerar,
}: RelatorioFiltrosState) {
	return (
		<div className="grid gap-3 md:grid-cols-4">
			<label className="flex flex-col gap-1 text-xs font-medium text-ink-muted">
				Período
				<select
					className="form-input w-full"
					value={periodo}
					onChange={(event) => onPeriodoChange(event.currentTarget.value as any)}
				>
					{Object.entries(PERIODOS).map(([label, value]) => (
						<option key={value} value={value}>
							{label}
						</option>
					))}
				</select>
			</label>

			<label className="flex flex-col gap-1 text-xs font-medium text-ink-muted">
				Data de referência
				<input
					className="form-input w-full"
					type="date"
					max={hojeISO()}
					value={data}
					onChange={(event) => onDataChange(event.currentTarget.value)}
				/>
			</label>

			{tipo === "FOLHA_PONTO" ? (
				<label className="flex flex-col gap-1 text-xs font-medium text-ink-muted">
					Professor
					<select
						className="form-input w-full"
						value={professorId}
						onChange={(event) => onProfessorChange(event.currentTarget.value)}
					>
						<option value="">Todos os professores</option>
						{professores.map((professor) => (
							<option key={professor.id} value={professor.id}>
								{professor.name}
							</option>
						))}
					</select>
				</label>
			) : (
				<span />
			)}

			<div className="flex items-end">
				<button type="button" className="btn w-full" disabled={loading} onClick={onGerar}>
					{loading ? "Gerando..." : "Gerar relatório"}
				</button>
			</div>
		</div>
	);
}
