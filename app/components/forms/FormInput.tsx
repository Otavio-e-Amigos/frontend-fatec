import { cloneElement, useContext, useEffect, useState } from "react";
import { FormControllerContext, FormDispatcherContext } from "./FormContext";
import { InputValidator } from "~/components/forms/FormController";
import AbstractValueFormatter, { type AbstractValueFormatterInterface } from "~/classes/base/AbstractValueFormatter";

function EyeIcon({ off }: { off?: boolean }) {
	return (
		<svg
			width="18"
			height="18"
			viewBox="0 0 20 20"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.6"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden
		>
			<path d="M1.5 10s3-5.5 8.5-5.5S18.5 10 18.5 10 15.5 15.5 10 15.5 1.5 10 1.5 10Z" />
			<circle cx="10" cy="10" r="2.5" />
			{off && <path d="M3.5 3.5l13 13" />}
		</svg>
	);
}

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
	error?: string;
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
	error,
}: FormInputProps) {
	const controller = useContext(FormControllerContext);
	const controllerAction = useContext(FormDispatcherContext);
	const [revealed, setRevealed] = useState(false); // usado só pelo type="password"
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
	};
	const errorMessage = error ?? controller?.getFieldErrorMessage(name);
	const errorId = `${name}-error`;

	function setFieldError(message?: string) {
		if (!controllerAction) return;

		controllerAction({
			action: message ? "setFieldError" : "cleanFieldError",
			fieldName: name,
			error: message ? { message } : undefined,
		});
	}

	function validate(value: string) {
		if (required && !value.trim()) return "Este campo é obrigatório.";
		if (validator && !validator.validate(value.replaceAll(/\D/g, ""))) {
			return validator.getMessage();
		}
	}

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		let currentValue = e.currentTarget.value;

		// TODO change this to class implementation
		// TODO apply unformat() and then format() for the value since the display on <input> is same when passed here
		if (formatter) {
			// console.log("currentValue")
			// console.log(currentValue)
			// console.log("formatter.unformat(currentValue)")
			// console.log(formatter.unformat(currentValue))
			currentValue = formatter.format(formatter.unformat(currentValue));
		}

		console.log(currentValue);
		e.currentTarget.value = currentValue;

		if (controller) controller.setFieldValue(name, currentValue);
		if (controller?.getFieldErrorMessage(name)) setFieldError(validate(currentValue));
		onChange?.(e);
	}

	const DefaultInputElement = (
		<input
			onChange={handleChange}
			onBlur={(e) => setFieldError(validate(e.currentTarget.value))}
			{...basicInputParameters}
			id={name}
			type={type === "password" && revealed ? "text" : type}
			className="form-input"
			aria-required={required || undefined}
			aria-invalid={Boolean(errorMessage)}
			aria-describedby={errorMessage ? errorId : undefined}
		/>
	);
	let SelectedInputElement = DefaultInputElement;

	const DefaultControllerLabel = (
		<p id={errorId} className="text-sm text-rose-500" role="alert">
			{errorMessage}
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

		case "password": {
			// reaproveita o input padrão (formatador, validação, controller) e só
			// troca o contorno: o wrapper vira o campo, o input fica "nu" dentro dele
			return (
				<div className={`flex ${labelAlignLookup[labelAlign]}`}>
					{DefaultLabelElement}
					<div className="form-input flex items-center gap-1 pr-1">
						{cloneElement(DefaultInputElement, { className: "w-full min-w-0" })}
						<button
							type="button"
							className="input-toggle"
							aria-label={revealed ? "Ocultar senha" : "Mostrar senha"}
							aria-pressed={revealed}
							onClick={() => setRevealed((r) => !r)}
						>
							<EyeIcon off={revealed} />
						</button>
					</div>
					{DefaultControllerLabel}
				</div>
			);
		}

		case "search": {
			return (
				<div className="form-input flex flex-row gap-3 items-center">
					<img src="/favicon.ico" className="size-5" />
					<input
						{...basicInputParameters}
						type="search"
						className="w-full"
						onChange={handleChange}
					/>
				</div>
			);
		}

		case 'select': {
			// insert select
		}
	}

	return DefaultWrapper;
}
