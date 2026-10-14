export interface AbstractValueFormatterOptionsInterface {
	originalCursorPosition?: number
}

export type AdvancedAbstractValueFormatterReturn = {
	value: any
	newCursorPosition?: number
}

export interface AbstractValueFormatterInterface {
	format(value: any, options: AbstractValueFormatterOptionsInterface): AdvancedAbstractValueFormatterReturn
	format(value: any, options?: AbstractValueFormatterOptionsInterface): any

	unformat(value: any, options: AbstractValueFormatterOptionsInterface): AdvancedAbstractValueFormatterReturn
	unformat(value:any, options?:AbstractValueFormatterOptionsInterface): any
}

export default class AbstractValueFormatter {
	static format(value: unknown, options: AbstractValueFormatterOptionsInterface): AdvancedAbstractValueFormatterReturn
	static format(value: unknown, options?: AbstractValueFormatterOptionsInterface): unknown | AdvancedAbstractValueFormatterReturn {
		throw new Error("this Error has been thrown by the Abstract class, This is done for classes to force implement their own variants. You must declare the functions provided by the abstract to prevent any mistakes.")
	}

	static unformat(value: unknown, options: AbstractValueFormatterOptionsInterface): AdvancedAbstractValueFormatterReturn
	static unformat(value: unknown, options?: AbstractValueFormatterOptionsInterface): unknown | AdvancedAbstractValueFormatterReturn{
		throw new Error("this Error has been thrown by the Abstract class, This is done for classes to force implement their own variants. You must declare the functions provided by the abstract to prevent any mistakes.")
	}

	// test() {}
}
