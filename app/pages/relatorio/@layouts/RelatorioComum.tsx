import type { ReactNode } from "react";

/** Cartão com um número do resumo. */
export function Indicador({
	label,
	value,
	hint,
}: {
	label: string;
	value: ReactNode;
	hint?: string;
}) {
	return (
		<div className="rounded-control border border-line bg-surface-sunken p-3">
			<p className="text-[11px] font-medium text-ink-muted">{label}</p>
			<p className="mt-1 text-xl font-semibold text-ink">{value}</p>
			{hint && <p className="mt-0.5 text-[11px] text-ink-muted">{hint}</p>}
		</div>
	);
}

export function Indicadores({ children }: { children: ReactNode }) {
	return (
		<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">{children}</div>
	);
}

/** Bloco com título, usado para cada lista do relatório. */
export function Secao({
	titulo,
	children,
}: {
	titulo: string;
	children: ReactNode;
}) {
	return (
		<section className="flex flex-col gap-2">
			<h3 className="text-sm font-semibold text-ink">{titulo}</h3>
			{children}
		</section>
	);
}

/**
 * Tabela simples de relatório. `totais` é a linha de totalização no final
 * (uma célula por coluna), pedida pelo requisito do relatório.
 */
export function RelatorioTabela({
	colunas,
	linhas,
	totais,
	vazio = "Nenhum registro no período.",
	nota,
}: {
	colunas: string[];
	linhas: ReactNode[][];
	totais?: ReactNode[];
	vazio?: string;
	nota?: string;
}) {
	if (linhas.length === 0) {
		return <p className="text-sm text-ink-muted">{vazio}</p>;
	}

	return (
		<div className="flex flex-col gap-1">
			<div className="table-wrap max-h-72 overflow-y-auto">
				<table className="table" data-density="compact" data-striped>
					<thead className="table-head">
						<tr>
							{colunas.map((coluna) => (
								<th key={coluna} scope="col" className="px-3 py-2">
									{coluna}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{linhas.map((linha, rowIdx) => (
							<tr key={rowIdx} className="table-row" data-odd={rowIdx % 2 === 1 || undefined}>
								{linha.map((cell, cellIdx) => (
									<td key={cellIdx} className="table-cell">
										{cell}
									</td>
								))}
							</tr>
						))}
					</tbody>
					{totais && (
						<tfoot>
							<tr className="border-t-2 border-line font-semibold text-ink">
								{totais.map((cell, idx) => (
									<td key={idx} className="table-cell">
										{cell}
									</td>
								))}
							</tr>
						</tfoot>
					)}
				</table>
			</div>
			{nota && <p className="text-[11px] text-ink-muted">{nota}</p>}
		</div>
	);
}

export const soma = (values: number[]) => values.reduce((acc, value) => acc + value, 0);
