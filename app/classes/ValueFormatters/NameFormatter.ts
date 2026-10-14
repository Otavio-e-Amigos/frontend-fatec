import AbstractValueFormatter, { type AbstractValueFormatterOptionsInterface, type AdvancedAbstractValueFormatterReturn } from "../base/AbstractValueFormatter";

export default class NameFormatter extends AbstractValueFormatter {
	static regex = /^\w$|\s\w/g;

	/**
	 * Formats text into name-like strings "Example Of Output", converting (almost) each start letter of the name in it's uppercase version.
	 * @param value
	 * @example
	 * ```
	 * const value = "hello there! how are you?"
	 * console.log(NameFormatter.format(value))
	 * // => Hello There! How Are You?
	 * ```
	 */
	static format(value:string, options: AbstractValueFormatterOptionsInterface) : AdvancedAbstractValueFormatterReturn
	static format(value: string, options?: AbstractValueFormatterOptionsInterface): string | AdvancedAbstractValueFormatterReturn {
		let newValue = value;
		console.log(options)
		const advancedReturn: AdvancedAbstractValueFormatterReturn = {
			value: undefined,
			newCursorPosition: options?.originalCursorPosition,
		}

		if (newValue.length > 1)
			newValue = newValue.replace(/^\w/g, (p) => p.toUpperCase());

		newValue = newValue.replaceAll(this.regex, (p) => {
			// console.log("p");
			// console.log(p);
			// TODO implement if name snippet has 2-3 characters long, remain low-case
			return p.toUpperCase();
		});

		if (options) advancedReturn.value = newValue;

		return options ? advancedReturn : newValue;
	}

	static unformat(value:string, options: AbstractValueFormatterOptionsInterface) : AdvancedAbstractValueFormatterReturn
	static unformat(value: string, options?: AbstractValueFormatterOptionsInterface) : string | AdvancedAbstractValueFormatterReturn {
		return value.toLowerCase();
		// return value.replaceAll(this.regex, (p) => {
		// 	console.log(p);
		// 	// TODO implement if name snippet has 2-3 characters long, remain low-case
		// 	return p.toLowerCase();
		// });
	}
}
