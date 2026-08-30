import { Link } from "react-router";
import Header from "~/layouts/Header";

/**
 * Tables have columns and rows, 
 */

class TableData {
  columns: any[];
  rows: any[]

  constructor() {
    this.columns = []
    this.rows = []
  }

  addColumn(name:string) {
    this.columns.push(name)
  }

  addRow(data:object | Array<any> | {columns: Array<string>, rows: Array<any>}) {
    // ["data01", "data02"] or
    // {column01: "data01", column02: "data02"}
    if (Array.isArray(data)) {
      // convert array position into object based on column positions
    } else if (typeof data === 'object' && data !== null) {
    }
    this.rows.push(data)
  }

  // Return an array of data by column's name in order
  // getDataByColumn(name:string) {}

  // Return an array of data by column's name in order
  // SortByColumn(name:string) {}

}

const tableTest = new TableData()

tableTest.addColumn("Column01")
tableTest.addColumn("Column02")
tableTest.addColumn("Column03")

tableTest.addRow(["data01", "data02", "data03"])
// tableTest.addRow({Column01: "data01", Column02: "data02", Column03: "data03"})


function TableContainer({data, layout}) {

}

function SimpleTableLayout({data}: {data: TableData}) {

  return (
    <table>
      <thead>
        <tr className="bg-slate-600">
          {}
          <th className="px-2 text-left">Tipo</th>
          <th className="px-2">Ação</th>
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, idx) => {
          console.log(row)
          return (
            <tr className="bg-slate-500">
              {row.map(data => (<td className="px-2 text-left">{data}</td>))}
              {/* <td className="px-2 text-left">1</td> */}
              {/* <td className="px-2 text-center"><Link to={""}>Formulário</Link></td> */}
            </tr>
          )

        })}
        {/* <tr className="bg-slate-500">
          <td className="px-2 text-left">Alguma coisa</td>
          <td className="px-2 text-center"><Link to={""}>Formulário</Link></td>
        </tr>
        <tr className="bg-slate-600">
          <td className="px-2 text-left">oskdoks</td>
          <td className="px-2 text-center">oskdoks</td>
        </tr> */}
      </tbody>
    </table>)
}

export default function Page() {
  return <main>
    <Header/>
    <section className="mt-5">
      <SimpleTableLayout data={tableTest}/>
    </section>
  </main>
}
