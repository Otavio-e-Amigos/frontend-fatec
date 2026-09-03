export default abstract class AbstractTableModel {
  abstract getValue(rowIndex: number, columnIndex: number): any; //SUGGESTION Gets value at specified coordinate on table

  abstract getColumnName(index: number): string;
  abstract getColumns(): string[];
  abstract getColumnSize(): number;
  abstract sortByColumn(index: number, order: "ASC" | "DESC"): Array<Array<any>> //Sorts TableData by specified column

  abstract getRows(): unknown[];
  abstract getRowSize(): number;
}
