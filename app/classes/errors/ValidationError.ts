import type AbstractAPIData from "~/modules/api/base/AbstractAPIData";

interface FieldError {
	name: string;
	message: string;
}

/**
 * thrown when a part of the system doesn't satisfies with a value or situation, throwning this as a result of it's validation that wasn't good.
 * This is used between validators, APIModule requests and others.
 */
export class ValidationError extends Error {
	name: string = "ValidationError";

	constructor(message: string) {
		super();
		this.message = message;
	}
}

/**
 * Variant of ValivationError, this is thrown when a form receives multiple field errors coming from API or other sources
 */
export class APIValidationError extends ValidationError {
	name: string = "APIValidationError";
	data: AbstractAPIData;

	constructor(
		message: string,
		data: AbstractAPIData,
	) {
		super(message);
		this.data = data;
	}
}

/**
 * Variant of ValivationForm, this is thrown when a form receives multiple field errors coming from API or other sources
 */
export class FormValidationError extends ValidationError {
	fields: Array<FieldError>;

	constructor(message: string, fields: Array<FieldError>) {
		super(message);
		this.fields = fields;
	}
}
