// This class allows for transforming object's properties into table models, adjusting which property stays at which columns and other parameters

import AbstractTableModel from "../base/AbstractTableModel";

type ObjectColumnData = {
	property: string,
	display: string
}

// TODO Test class
export default class ObjectTableModel<T extends Record<string, any>> extends AbstractTableModel {
	private list: Array<T>
	private columns: ObjectColumnData[]

	constructor(list:Array<T>, columns: ObjectColumnData[]) {
		super()
		this.list = list

		// columns are separated and distributed by object's properties, like "Column01WithDifferentNameThanObjectPropertyOriginalName: objectProperty01" and so on.
		this.columns = columns
	}


	/**
	 * Returns a value from an object inside the model, based on object's row and column's index.
	 * @param rowIndex row's index
	 * @param columnIndex column's index
	 * @returns table coordinate's value
	 */
	getValue(rowIndex: number, columnIndex: number): any {
		return this.list[ rowIndex ][ this.columns[columnIndex].property ]
	}

	getColumnName(index: number): string {
		return this.columns[index].display;
	}

	/**
	 * Get all column names. This method only returns the column names, not properties.
	 * @returns Column name list
	 */
	getColumns(): string[] {
		return this.columns.map(column => column.display)
		// throw new Error("Method not implemented.");
	}

	getColumnSize(): number {
		return this.columns.map(column => column.display).length
	}

	sortByColumn(index: number, order: "ASC" | "DESC"): Array<Array<any>> {
		throw new Error("Method not implemented.");
	}

	/**
	 * Get an Array of Objects inserted in the table
	 * @returns Object list
	 */
	getRows(): T[] {
		return this.list;
	}


	getRowSize(): number {
		return this.list.length
	}

}
