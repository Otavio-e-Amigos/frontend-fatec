import AbstractValueFormatter, { type AbstractValueFormatterOptionsInterface, type AdvancedAbstractValueFormatterReturn } from "../base/AbstractValueFormatter";

export default class OnlyTextFormatter extends AbstractValueFormatter {
	static regex = /\d/g;

	/**
	 * Formats string into text only.
	 * @param value
	 * @example
	 * ```
	 * const value = "123 helloes goes within you"
	 * console.log(TextOnlyFormatter.format(value))
	 * // => helloes goes within you
	 * ```
	 */
	static format(value:string, options: AbstractValueFormatterOptionsInterface) : AdvancedAbstractValueFormatterReturn
	static format(value: string, options?: AbstractValueFormatterOptionsInterface): string | AdvancedAbstractValueFormatterReturn {
		return value.replace(this.regex, "");
	}

	static unformat(value:string, options: AbstractValueFormatterOptionsInterface) : AdvancedAbstractValueFormatterReturn
	static unformat(value: string, options?: AbstractValueFormatterOptionsInterface) : string | AdvancedAbstractValueFormatterReturn {
		return value;
	}
}
