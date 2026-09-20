import { useContext, useEffect } from "react";
import FormContext from "./form.context";
import { InputValidator } from "~/pages/professor/FormController";

type FormInputTypesSupported = React.HTMLInputTypeAttribute | "time-range";
type FormInputProps = {
	name: string;
	label?: string;
	value?: any;
	validator: InputValidator;
	type?: FormInputTypesSupported;
	disabled?: boolean;
	labelAlign?: "top" | "left";
	placeholder?: string;
	required?: boolean;
	InputFormatter?: any;

	onChange?: any;
};

class PhoneNumberValidator extends InputValidator {
	constructor() {
		super(/^\d{11}$/);
	}
}

// TODO optimize and refactor component returnings
export default function FormInput({
	name,
	label,
	value,
	InputFormatter,
	validator,
	type = "text",
	disabled,
	labelAlign = "top",
	placeholder,
	onChange,
	required,
}: FormInputProps) {
	const controller = useContext(FormContext);
	let formValue = value ?? controller.getFieldValue(name);

	if (!controller.fieldExists(name)) controller.addField(name, value);
	if (validator) controller.setFieldValidator(name, validator);

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
				const currentValue = e.currentTarget.value;

				let newValue = InputFormatter
					? InputFormatter(currentValue)
					: currentValue;

				e.currentTarget.value = newValue.displayValue ?? currentValue;
				controller.setFieldValue(name, newValue.newValue);
			}}
			onBlur={() => {console.log("input is now out of focus! validate field and show errors here!")}}
			{...basicInputParameters}
			type={type}
			className="form-input"
		/>
	);
	let SelectedInputElement = DefaultInputElement;

	const DefaultControllerLabel = (
		<p className="text-sm text-hint-warning">
			{controller.getFieldErrorMessage(name)}
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
	}

	return DefaultWrapper;
}
