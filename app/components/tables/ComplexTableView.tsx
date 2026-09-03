import { useState } from "react";
import type AbstractTableModel from "~/classes/base/AbstractTableModel";
import { isComplexRow } from "~/classes/TableModel/DefaultTableModel";

type ColumnData = {currentColumn: number | undefined, order: "ASC" | "DESC"}

export default function ComplexTableModelView({ data }: { data: AbstractTableModel }) {
  const columns = data.getColumns()
  const [rows, setRows] = useState(data.getRows() as Array<any[]>)
  let [columnData, setColumnData] = useState<ColumnData>({currentColumn: undefined, order: "ASC"})

  function TriggerTableSort(idx: number) {
    setRows(data.sortByColumn(idx, columnData.order as "ASC" | "DESC"));
    columnData.currentColumn = idx
    if (columnData.order === 'ASC') {
      columnData.order = "DESC"
      setColumnData(columnData)
    } else {
      columnData.order = "ASC"
      setColumnData(columnData)
    }
  }

  const arrows = {
    ASC: <>&#8593;</>,
    DESC: <>&#8595;</>
  }

  return (
    <table>
      <thead>
        <tr className="bg-slate-600">
          {
            columns.map((column, idx) => (
              <th key={idx}>
                <button className={`px-2 flex flex-row gap-1 ${idx == 0 ? "justify-start" : "justify-center"} w-full hover:bg-slate-700`} onClick={() => { TriggerTableSort(idx) }}>
                  {column}
                  <span className={`${columnData.currentColumn != idx && "text-transparent"}`}>
                    {arrows[columnData.order]}
                  </span>
                </button>
              </th>
            ))
          }
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => {
          console.log(row)
          return (
              <tr key={idx} className={`${idx % 2 == 0 ? "bg-slate-500" : "bg-slate-600"}`}>
              {/*<td key={idx} className="px-2 text-left">{data}</td>*/}
                {
                row.map((data, idx) => isComplexRow(data) ? <td key={idx} className="px-2 text-left">{data.display}</td> :<td key={idx} className="px-2 text-left">{data}</td>)
                }
            </tr>
            )
          })
        }
      </tbody>
    </table>)
}
