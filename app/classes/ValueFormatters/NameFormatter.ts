import AbstractValueFormatter from "../base/AbstractValueFormatter";

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
	static format(value: string): string {
		let newValue = value;

		//block number entries
		// newValue = newValue.replaceAll(/\d/g, "");

		//replace the first letter into UpperCase, for some reason, replaceAll doesn't replace when unformat() uses toLowerCase only()
		if (newValue.length > 1)
			newValue = newValue.replace(/^\w/g, (p) => p.toUpperCase());
		return newValue.replaceAll(this.regex, (p) => {
			// console.log("p");
			// console.log(p);
			// TODO implement if name snippet has 2-3 characters long, remain low-case
			return p.toUpperCase();
		});
	}

	static unformat(value: string): string {
		return value.toLowerCase();
		// return value.replaceAll(this.regex, (p) => {
		// 	console.log(p);
		// 	// TODO implement if name snippet has 2-3 characters long, remain low-case
		// 	return p.toLowerCase();
		// });
	}
}
