interface FieldError {
	name: string;
	message: string;
}

export class ValidationError extends Error {
	name: string = "ValidationError";
	// fields: Array<FieldError>;

	constructor(message: string) {
		super();
		this.message = message;
		// this.fields = fields;
	}
}

export class FormValidationError extends ValidationError {
	fields: Array<FieldError>;

	constructor(message: string, fields: Array<FieldError>) {
		super(message);
		this.fields = fields;
	}
}
