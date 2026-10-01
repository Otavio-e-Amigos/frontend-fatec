import AbstractTableModel from "~/classes/base/AbstractTableModel";

type complexRowData = {
  value: string | number,
  display: any
}

export function isComplexRow(row: any): row is complexRowData {
  return (row as complexRowData).value !== undefined || (row as complexRowData).display !== undefined
}

type supportedRowTypes = string | number | complexRowData

export default class DefaultTableModel extends AbstractTableModel {
  private list: Array<supportedRowTypes>[]
  private columns: string[]

  constructor(list:Array<supportedRowTypes>[], columns:string[]) {
    super()
    this.list = list
    this.columns = columns
    // console.log(list)
  }

  addColumn(name:string) {
    this.columns.push(name)
  }

  addRow(value:any) {
    this.list.push(value)
  }


  getValue(rowIndex: number, columnIndex: number) {
    const listValue = this.list[rowIndex][columnIndex]

    if (isComplexRow(listValue)) {
      console.log("looks like this value is an complexRow, apply determined code")
      return listValue.value
    } else {
      return listValue
    }
  }

  getColumnSize(): number {
    return this.columns.length;
  }

  getRowSize(): number {
    return this.list.length;
  }

  sortByColumn(index: number, order: "ASC" | "DESC"): Array<Array<any>> //Sorts TableData by specified column
  {
    const selectedRow: {value: any, origin: any[]}[] = []
    const finalResult = []

    const typeAlgorithms: Record<string, any> = {
      number: {
        ASC: (a:number, b:number) => a - b,
        DESC: (a:number, b:number) => b - a
      },
      string: {
        ASC: (a:string, b:string) => a.localeCompare(b),
        DESC: (a:string, b:string) => b.localeCompare(a)
      },
      // default: {
      //   ASC: (a:string, b:string) => a.localeCompare(b),
      //   DESC: (a:string, b:string) => b.localeCompare(a)
      // }
    }
    const dataColumn: {type: string, discoveredTypes: any[]} = {
      type: "mixed",
      discoveredTypes: []
    }

    for (let i = 0; i < this.getRowSize(); i++) {
      console.log(typeof this.getValue(i, index))

      selectedRow.push({ value: this.getValue(i, index), origin: this.list[i] });
      dataColumn.discoveredTypes.push(typeof this.getValue(i, index))
    }

    let discoveredType = false
    Object.keys(typeAlgorithms).forEach(type => {
      if (!discoveredType) dataColumn.discoveredTypes = dataColumn.discoveredTypes.filter(discoveredType => discoveredType !== type)

      if (dataColumn.discoveredTypes.length == 0 && !discoveredType) {
        dataColumn.type = type
        discoveredType = true
      }
    })

    if (dataColumn.discoveredTypes.length != 0) {dataColumn.type = "mixed"}

    if (dataColumn.type !== "mixed") {
      selectedRow.sort((a, b) => typeAlgorithms[dataColumn.type][order](a.value, b.value))
    }

    for (let i = 0; i < selectedRow.length; i++) {
      finalResult.push(selectedRow[i].origin);
    }


    // console.log(typeAlgorithms[dataColumn.type][order])
    // console.log(selectedRow)
    console.log(finalResult)

    return finalResult
    // throw new Error("Method not implemented.");
  }

  getColumnName(index: number): string {
    return this.columns[index];
  }

  getColumns(): string[] {
    return this.columns;
  }

  getRows(): any[] {
    return this.list;
  }
}
