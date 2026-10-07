import AbstractValueFormatter from "../base/AbstractValueFormatter";

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
	static format(value: string): string {
		const digits = value.replace(this.regex, "").slice(0, 11);

		if (digits.length > 9) {
			return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
		} else if (digits.length > 6) {
			return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
		} else if (digits.length > 3) {
			return `${digits.slice(0, 3)}.${digits.slice(3)}`;
		} else if (digits.length <= 3) {
			return `${digits.slice(0)}`;
		}

		return digits
	}

	static unformat(value: string): string {
		return value.replace(this.regex, "");
	}
}
