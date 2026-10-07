import { InputValidator } from "~/components/forms/FormController";

class PhoneValidator extends InputValidator {
	constructor() {
		super(/^\d{11}$/);
	}
}
