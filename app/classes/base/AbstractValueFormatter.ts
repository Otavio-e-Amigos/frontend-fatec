export interface AbstractValueFormatterInterface {
	format(value:any): any
	unformat(value:any): any
}

export default class AbstractValueFormatter {
	static format(value: unknown): unknown {
		throw new Error("this Error has been thrown by the Abstract class, This is done for classes to force implement their own variants. You must declare the functions provided by the abstract to prevent any mistakes.")
	}
	static unformat(value: unknown): unknown {
		throw new Error("this Error has been thrown by the Abstract class, This is done for classes to force implement their own variants. You must declare the functions provided by the abstract to prevent any mistakes.")
	}

	// test() {}
}
