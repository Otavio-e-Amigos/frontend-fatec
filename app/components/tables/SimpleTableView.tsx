import type AbstractTableModel from "~/classes/base/AbstractTableModel";

// versão sem ordenação nem detalhes; usa o mesmo CSS da ComplexTableView
export default function SimpleTableModelView({
	data,
	striped = true,
}: {
	data: AbstractTableModel;
	striped?: boolean;
}) {
	const columns = data.getColumns();
	const rows = data.getRows() as Array<any[]>;

	return (
		<div className="table-wrap">
			<table className="table" data-striped={striped || undefined}>
				<thead className="table-head">
					<tr>
						{columns.map((column, idx) => (
							<th key={idx} scope="col" className="px-4 py-3">
								{column}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((row, rowIdx) => (
						<tr
							key={rowIdx}
							className="table-row"
							data-odd={rowIdx % 2 === 1 || undefined}
						>
							{row.map((cell, cellIdx) => (
								<td key={cellIdx} className="table-cell">
									{cell}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
