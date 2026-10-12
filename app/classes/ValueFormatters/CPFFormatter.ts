import AbstractValueFormatter, { type AbstractValueFormatterOptionsInterface, type AdvancedAbstractValueFormatterReturn } from "../base/AbstractValueFormatter";

export default class CPFFormatter extends AbstractValueFormatter {
	static regex = /\D/g;

	/**
	 * Formats text into government document format
	 * @param value
	 * @example
	 * ```
	 * const value = "12345678901"
	 * console.log(CPFFormatter.format(value))
	 * // => "123.456.789-01"
	 * ```
	 */
	static format(value:string, options: AbstractValueFormatterOptionsInterface) : AdvancedAbstractValueFormatterReturn
	static format(value: string, options?: AbstractValueFormatterOptionsInterface): string | AdvancedAbstractValueFormatterReturn {
		const digits = value.replace(this.regex, "").slice(0, 11);
		let formatted = digits;
		const advancedReturn: AdvancedAbstractValueFormatterReturn = {
			value: undefined,
			newCursorPosition: 0,
		}

		if (digits.length > 9) {
			formatted = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
		} else if (digits.length > 6) {
			formatted = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
		} else if (digits.length > 3) {
			formatted = `${digits.slice(0, 3)}.${digits.slice(3)}`;
		} else if (digits.length <= 3) {
			formatted = `${digits.slice(0)}`;
		}

		if (options) {
			advancedReturn.value = formatted;
			if (options.originalCursorPosition) advancedReturn.newCursorPosition = options.originalCursorPosition + 1;
		}

		return options ? advancedReturn : formatted
	}

	static unformat(value:string, options: AbstractValueFormatterOptionsInterface) : AdvancedAbstractValueFormatterReturn
	static unformat(value: string, options?: AbstractValueFormatterOptionsInterface): string | AdvancedAbstractValueFormatterReturn {
		return value.replace(this.regex, "");
	}
}
