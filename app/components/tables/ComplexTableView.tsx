import { Fragment, useEffect, useId, useState, type ReactNode } from "react";
import type AbstractTableModel from "~/classes/base/AbstractTableModel";
import { isComplexRow } from "~/classes/TableModels/DefaultTableModel";

type Order = "ASC" | "DESC";
type SortState = { column?: number; order: Order };

function SortIcon() {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden
		>
			<path d="M4 3v10M2 5l2-2 2 2M2 11l2 2 2-2M8.5 4H14M8.5 8H13M8.5 12H12" />
		</svg>
	);
}

function ChevronIcon() {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden
		>
			<path d="m4 6 4 4 4-4" />
		</svg>
	);
}

export default function ComplexTableModelView({
	data,
	renderDetails,
	density = "comfortable",
	striped = true,
	actionsColumn = false,
}: {
	data: AbstractTableModel;
	// se informado, cada linha ganha uma seta que abre uma faixa de detalhes
	renderDetails?: (row: any[]) => ReactNode;
	density?: "comfortable" | "compact";
	// linhas alternadas (branca / avermelhada). Passe striped={false} para desligar
	striped?: boolean;
	// a última coluna só tem botões de ação (<RowActions>): fica estreita, à direita e sem ordenação
	actionsColumn?: boolean;
}) {
	const uid = useId();
	const columns = data.getColumns();
	const [rows, setRows] = useState(data.getRows() as Array<any[]>);
	const [sort, setSort] = useState<SortState>({ order: "ASC" });
	// linhas abertas, identificadas pela própria referência da linha: continuam
	// corretas depois de uma ordenação
	const [expanded, setExpanded] = useState<Set<any[]>>(new Set());

	// se a página entregar um modelo novo (ex.: depois de uma busca), a tabela acompanha
	useEffect(() => {
		setRows(data.getRows() as Array<any[]>);
		setSort({ order: "ASC" });
		setExpanded(new Set());
	}, [data]);

	function toggleSort(idx: number) {
		const order: Order =
			sort.column === idx && sort.order === "ASC" ? "DESC" : "ASC";
		setSort({ column: idx, order });
		setRows(data.sortByColumn(idx, order));
	}

	function toggleRow(row: any[]) {
		setExpanded((prev) => {
			const next = new Set(prev);
			if (next.has(row)) next.delete(row);
			else next.add(row);
			return next;
		});
	}

	return (
		<div className="table-wrap">
			<table
				className="table"
				data-density={density}
				data-striped={striped || undefined}
			>
				<thead className="table-head">
					<tr>

						{columns.map((column, idx) => {
							if (actionsColumn && idx === columns.length - 1) {
								return (
									<th key={idx} scope="col" data-actions className="px-4 py-3">
										<span className="sr-only">{column}</span>
									</th>
								);
							}
							if (column === "") {
								return <th key={idx} scope="col" className="px-4 py-3" />;
							}
							const sorted = sort.column === idx ? sort.order : undefined;
							return (
								<th
									key={idx}
									scope="col"
									aria-sort={
										sorted === "ASC"
											? "ascending"
											: sorted === "DESC"
												? "descending"
												: "none"
									}
								>
									<button
										type="button"
										className="table-sort"
										data-sorted={sorted?.toLowerCase()}
										onClick={() => toggleSort(idx)}
									>
										{column}
										<SortIcon />
									</button>
								</th>
							);
						})}
					</tr>
				</thead>

				<tbody>
					{rows.length === 0 && (
						<tr>
							<td className="table-empty" colSpan={columns.length}>
								Nenhum registro para mostrar.
							</td>
						</tr>
					)}

					{rows.map((row, rowIdx) => {
						const isOpen = expanded.has(row);
						const detailsId = `${uid}-details-${rowIdx}`;

						return (
							<Fragment key={rowIdx}>
								<tr
									className="table-row"
									data-odd={rowIdx % 2 === 1 || undefined}
									data-expanded={isOpen || undefined}
								>
									{row.map((cell, cellIdx) => {
										const content = isComplexRow(cell)
											? (cell.display ?? cell.value)
											: cell;

										return (
											<td
												key={cellIdx}
												className="table-cell"
												data-actions={
													(actionsColumn && cellIdx === row.length - 1) || undefined
												}
											>
												{cellIdx === 0 && renderDetails ? (
													<div className="table-lead">
														<button
															type="button"
															className="table-toggle"
															aria-expanded={isOpen}
															aria-controls={detailsId}
															aria-label={isOpen ? "Recolher detalhes" : "Ver detalhes"}
															onClick={() => toggleRow(row)}
														>
															<ChevronIcon />
														</button>
														{content}
													</div>
												) : (
													content
												)}
											</td>
										);
									})}
								</tr>

								{renderDetails && isOpen && (
									<tr className="table-details" id={detailsId}>
										<td colSpan={columns.length}>{renderDetails(row)}</td>
									</tr>
								)}
							</Fragment>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
