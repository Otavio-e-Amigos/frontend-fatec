import type AbstractTableModel from "~/classes/base/AbstractTableModel"

export default function SimpleTableModelView({ data }: { data: AbstractTableModel }) {
  const columns = data.getColumns()
  const rows = data.getRows() as Array<any[]>

  // data.sortByColumn(0, "ASC")

  return (
    <table>
      <thead>
        <tr className="bg-slate-600">
          {columns.map((column, idx) => (<th key={idx} className={`px-2 ${idx == 0 && "text-left"}`}>{column}</th>))}
          {/*<th className="px-2 text-left">Tipo</th>*/}
          {/*<th className="px-2">Ação</th>*/}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => {
          return (
          <tr key={idx} className={`${idx % 2 == 0 ? "bg-slate-500" : "bg-slate-600"}`}>
              {row.map((data, idx) => (<td key={idx} className="px-2 text-left">{data}</td>))}
            </tr>
          )

        })}
      </tbody>
    </table>)
}
