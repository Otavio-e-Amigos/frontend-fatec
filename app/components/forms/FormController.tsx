import React, { useState } from "react";

export interface FormError {
	message?: string;
}

//doesn't sound interesting if you can add functionality where you can group certain
// inputs and it converts it into objects and things like that,
// removing the necessity of orchestrating them into the action code repeteatly?
// And when really submitting to some API or code,
// FormController automatically converts the fieldValues into their respective format, like JSON or smth else?
interface ExportableFormFormat {
	export(data: any): number;
	exportReturnType: unknown;
}

interface FormFieldController extends Record<string, any> {
	value: any;
	validator?: InputValidator;
	error?: FormError;
}

class FieldFormController {
	private _value: any;
	private _validator?: InputValidator | undefined;
	private _error?: FormError | undefined;

	constructor(
		value: any,
		params: { validator?: InputValidator; error?: FormError },
	) {
		this._value = value;
		this._validator = params.validator;
		this._error = params.error;
	}

}

/**
 * FormController: Specialized object for controlling forms and handling data flow automatically,
 * exporting or controlling fields as needed with extensible modules and configurations.
 */
export default class FormController {
	private fields: Record<string, FormFieldController> = {};
	private error?: FormError;
	private submitButtonPressed: boolean = false;

	addField(
		fieldName: string,
		value?: any,
		params?: { validator?: InputValidator; error?: FormError },
	) {
		this.fields[fieldName] = {
			value,
			validator: params?.validator,
			error: params?.error,
		};
	}

	setFieldValue(fieldName: string, value: any) {
		if (!this.fieldExists(fieldName)) return;

		this.fields[fieldName].value = value;
		// console.log(this.fields[fieldName]);
		// console.log(this.fields);
	}

	// notify() {
	// 	this.listeners
	// }

	getFieldValue(fieldName: string) {
		if (!this.fieldExists(fieldName)) return undefined;

		return this.fields[fieldName].value;
	}

	setFieldValidator(fieldName: string, validator: InputValidator) {
		if (!this.fieldExists(fieldName)) this.addField(fieldName);

		this.fields[fieldName].validator = validator;
	}

	setFieldError(fieldName: string, error?: FormError) {
		if (!this.fieldExists(fieldName)) this.addField(fieldName);

		this.fields[fieldName].error = error ?? {};
		console.log(this.fields[fieldName].error);
	}

	cleanFieldError(fieldName:string) {
		if (!this.fieldExists(fieldName)) this.addField(fieldName);

		this.fields[fieldName].error = undefined;		
	}

	getFieldErrorMessage(fieldName: string) {
		if (!this.fieldExists(fieldName)) return;
		return this.fields[fieldName].error?.message;
	}

	fieldExists(fieldName: string) {
		return this.fields[fieldName] ? true : false;
	}

	deleteField(fieldName: string) {
		if (!this.fieldExists(fieldName)) return;

		delete this.fields[fieldName];
	}

	setSubmissionPress(state: boolean) {
		this.submitButtonPressed = state;
	}

	validateField(fieldName: string, value: any) {
		const result = this.fields[fieldName].validator?.validate(value);

		if (!result) {
			//mark that controller cant submit data due to validation errors,
			// set error message from InputValidator to put on InputController
		}

		return result;
	}
	/**
	 * cleans all existents errors on fields and Controller.
	 * @param persistOnController if enabled, error object persists on controler, cleaning errors only on fields
	 */
	cleanErrors(persistOnController?: boolean) {}
	/**
	 * Exports Form Controller into a specified format,
	 * like JSON or raw FormData object through FormControllerExportable class family
	 */
	// export<T extends ExportableFormFormat>(): T["exportReturnType"] {
	// }
}

/**
 * Inserted on FormInput components, this class (or function)
 * validates and blocks FormController from sending the form if a certain criteria has not been met.
 * Does it sounds interesting for the <input> to have value formatation too?
 */
export abstract class InputValidator {
	private criteria: RegExp;

	constructor(criteria: RegExp) {
		this.criteria = criteria;
	}

	validate(testValue: string | number) {
		let value = typeof testValue === "number" ? String(testValue) : testValue;

		return this.criteria.test(value);
	}
}
