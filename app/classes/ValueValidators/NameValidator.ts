import { InputValidator } from "~/components/forms/FormController";

class NameValidator extends InputValidator {
	constructor() {
		// super(/^\d{11}$/);

		// RULES:
		// - must not include numbers
		// - must not include any special characters like !@#$%¨&*() (except for hiphen or dot)
		// -
		super(/!\d/);
	}
}
