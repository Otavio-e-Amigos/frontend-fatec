import { useContext, useEffect, useState } from "react";
import { FormControllerContext, FormDispatcherContext } from "./FormContext";
import { InputValidator } from "~/components/forms/FormController";
import AbstractValueFormatter, { type AbstractValueFormatterInterface } from "~/classes/base/AbstractValueFormatter";

type FormInputTypesSupported =
	React.HTMLInputTypeAttribute | "time-range" | "select";
type FormInputProps = {
	name: string;
	label?: string;
	value?: any;
	validator?: InputValidator;
	type?: FormInputTypesSupported;
	disabled?: boolean;
	labelAlign?: "top" | "left";
	placeholder?: string;
	required?: boolean;
	ValueFormatter?: AbstractValueFormatter;
	onChange?: any;
};

// TODO optimize and refactor component returnings
export default function FormInput({
	name,
	label,
	value,
	ValueFormatter,
	validator,
	type = "text",
	disabled,
	labelAlign = "top",
	placeholder,
	onChange,
	required,
}: FormInputProps) {
	const controller = useContext(FormControllerContext);
	const controllerAction = useContext(FormDispatcherContext);
	// const {error} = useState(controller && controller.getFieldErrorMessage(name))
	const formatter = ValueFormatter && ValueFormatter as AbstractValueFormatterInterface

	// useEffect(() => {
	// 	console.log("controller changed!")
	// 	console.log(controller)
	// }, [controller])

	if (controller) {
		var formValue = value ?? controller.getFieldValue(name);

		// if (!controller.fieldExists(name)) controller.addField(name, value);
		if (!controller.fieldExists(name))
			controllerAction({ action: "addField", fieldName: name });
		if (validator) controller.setFieldValidator(name, validator);
	}

	// const validator = new PhoneNumberValidator()

	const basicInputParameters = {
		name: name,
		disabled: disabled,
		placeholder: placeholder,
		defaultValue: formValue,
		// onChange: onChange ?? undefined,
	};

	const DefaultInputElement = (
		<input
			onChange={(e) => {
				let currentValue = e.currentTarget.value;

				// TODO change this to class implementation
				// TODO apply unformat() and then format() for the value since the display on <input> is same when passed here
				if (formatter) {
					// console.log("currentValue")
					// console.log(currentValue)
					// console.log("formatter.unformat(currentValue)")
					// console.log(formatter.unformat(currentValue))
					currentValue = formatter.format(formatter.unformat(currentValue))
				}

				console.log(currentValue)
				e.currentTarget.value = currentValue;

				if (controller) controller.setFieldValue(name, currentValue);
			}}
			onBlur={(e) => {
				// TODO change to dynamic validation
				// TODO apply ValueFormatter.unformat() before validating value
				// TODO make ValueValidator throw ValidationError if result is unsastifiable
				const validationStatus = validator
					? validator.validate(e.currentTarget.value.replaceAll(/\D/g, ""))
					: true;
				console.log(validationStatus);
				if (!validationStatus) {
					if (controllerAction)
						controllerAction({
							action: "setFieldError",
							fieldName: name,
							error: {
								message: "Something's not right on this field. Please check.",
							},
						});
				} else {
					if (controllerAction)
						controllerAction({ action: "cleanFieldError", fieldName: name });
				}
				console.log(
					"input is now out of focus! validate field and show errors here!",
				);
			}}
			{...basicInputParameters}
			type={type}
			className="form-input"
		/>
	);
	let SelectedInputElement = DefaultInputElement;

	const DefaultControllerLabel = (
		<p className="text-sm text-hint-warning">
			{controller && controller.getFieldErrorMessage(name)}
		</p>
	);

	const DefaultLabelElement = label && (
		<label htmlFor={name}>
			{label} {required && <span className="text-hint-warning">*</span>}
		</label>
	);

	const labelAlignLookup = {
		top: "flex-col",
		left: "flex-row gap-2 items-center",
		right: "flex-row-reverse gap-2 items-center",
	};

	let DefaultWrapper = (
		<div className={`flex ${labelAlignLookup[labelAlign]}`}>
			{DefaultLabelElement}
			{SelectedInputElement}
			{DefaultControllerLabel}
		</div>
	);

	// reduce switch() for a lookup table if this gets too big
	switch (type) {
		case "time-range": {
			SelectedInputElement = (
				<div className="form-input flex flex-row justify-between w-fit gap-5">
					<input {...basicInputParameters} type="time" />
					<input {...basicInputParameters} type="time" />
				</div>
			);
			return DefaultWrapper;
		}

		case "checkbox": {
			SelectedInputElement = (
				<input
					{...basicInputParameters}
					type={"checkbox"}
					className="form-input input-checkbox"
				/>
			);
			return (
				<div className={`flex flex-row gap-2 items-center`}>
					{SelectedInputElement}
					{DefaultLabelElement}
					{DefaultControllerLabel}
				</div>
			);
		}

		case "search": {
			return (
				<div className="form-input flex flex-row gap-3 items-center">
					<img src="/favicon.ico" className="size-5" />
					<input {...basicInputParameters} type="search" className="w-full" />
				</div>
			);
		}

		case 'select': {
			// insert select
		}
	}

	return DefaultWrapper;
}
