import AbstractValueFormatter from "../base/AbstractValueFormatter";

/**
 * Formats phone raw numbers into a phone number display
 */
export default class PhoneFormatter extends AbstractValueFormatter {
	/**
	 * converts raw phone data into display
	 * @param value raw phone number
	 * @returns display phone number data
	 */
	static format(value: string): string {
		const digits = value.trim().replace(/\D/g, "").slice(0, 11);

		if (digits.length > 7) {
			return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
		} else if (digits.length > 2) {
			return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
		} else if (digits.length > 0) {
			return `(${digits}`;
		}

		return digits;
	}

	/**
	 * converts display phone data into raw
	 * @param value phone number
	 * @returns raw phone number data
	 */
	static unformat(value: string): string {
		return value.trim().replace(/\D/g, "").slice(0, 11);
	}
}
