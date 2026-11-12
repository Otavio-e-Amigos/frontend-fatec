import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
	type SyntheticEvent,
} from "react";
import { FormControllerContext, FormDispatcherContext } from "./FormContext";
import { type AbstractValueFormatterInterface } from "~/classes/base/AbstractValueFormatter";
import type {
	FormInputContextProvider,
	FormInputProps,
	InputElementCursorPositionState,
} from "./FormInput.types";
import PasswordInput from "./inputs/PasswordInput";
import GenericInput from "./inputs/GenericInput";
import SelectInput from "./inputs/SelectInput";
import SearchInput from "./inputs/SearchInput";
import CheckboxInput from "./inputs/CheckboxInput";

export const FormInputContext = createContext<FormInputContextProvider>({});

const initialInputElementCursorPositionState = {
	start: 0,
	end: 0,
	inputElement: undefined,
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
	hideRequiredLabel,
	options,
	submitFormattedData = false,
	lettersOnly = false,
	maxLength,
}: FormInputProps) {
	const controller = useContext(FormControllerContext);
	const controllerAction = useContext(FormDispatcherContext);

	const [revealed, setRevealed] = useState(false); // usado só pelo type="password"
	const formatter =
		ValueFormatter && (ValueFormatter as AbstractValueFormatterInterface);

	const errorMessage = useMemo(() => {
		return controller?.getFieldErrorMessage(name);
	}, [controller]);

	const [cursorPosition, setCursorPosition] =
		useState<InputElementCursorPositionState>(
			initialInputElementCursorPositionState,
		);

	const [currentValue, setCurrentValue] = useState<any>("");
	const currentFormattedValue = useMemo(() => {
		const formattedObject =
			formatter &&
			formatter.format(currentValue, {
				originalCursorPosition: cursorPosition.start,
			});
		const formattedValue = formatter && formattedObject?.value;
		const newCursorPosition =
			formattedObject?.newCursorPosition ?? cursorPosition.start;

		setCursorPosition({
			start: newCursorPosition,
			end: newCursorPosition,
			inputElement: cursorPosition.inputElement,
		});
		return formatter ? formattedValue : currentValue;
	}, [currentValue]);

	// adds field properties automatically to FormController, with values and properties it contains
	useEffect(() => {
		let overrideValue = value ?? controller?.getFieldValue(name) ?? "";
		if (!controller?.fieldExists(name))
			controller?.addField(name, overrideValue, { validator });

		setCurrentValue(overrideValue);
	}, []);

	// rearranges cursor position on input or smth, i don't have any ####### idea what did i made here in the end because i forgot to comment this
	useEffect(() => {
		if (cursorPosition.inputElement) {
			const element = cursorPosition.inputElement;
			controller?.setFieldValue(name, currentValue);
			console.log(cursorPosition);
			if (element.selectionStart && element.selectionEnd) {
				if (element.selectionStart !== cursorPosition.start) {
					element.selectionStart = cursorPosition.start;
				}
				if (element.selectionEnd !== cursorPosition.end) {
					element.selectionEnd = cursorPosition.end;
				}
			}
		}
		// console.log(controller);
	}, [currentValue]);

	const basicInputParameters = {
		name: name,
		disabled: disabled,
		placeholder: placeholder,
		maxLength,
		// defaultValue: currentFormattedValue,
		value: currentFormattedValue,
		// onChange: onChange ?? undefined,
	};

	const labelAlignLookup = {
		top: "flex-col",
		left: "flex-row gap-2 items-center",
		right: "flex-row-reverse gap-2 items-center",
	};

	// default onChange implementation for <FormInput>, important for every <FormInput> fields implementations
	function handleChange(e: SyntheticEvent<HTMLInputElement>) {
		const startCursorPosition = e.currentTarget.selectionStart ?? 0;
		const endCursorPosition = e.currentTarget.selectionEnd ?? 0;

		setCursorPosition({
			start: startCursorPosition,
			end: endCursorPosition,
			inputElement: e.currentTarget,
		});

		// TODO replace `lettersOnly` attribute to ValueFormatter instead
		const inputValue = lettersOnly
			? // ? e.currentTarget.value.replace(/\d/g, "")
				e.currentTarget.value
			: e.currentTarget.value;

		if (inputValue !== e.currentTarget.value)
			e.currentTarget.value = inputValue;

		const nextValue = formatter ? formatter.unformat(inputValue) : inputValue;
		controller?.setFieldValue(name, nextValue);

		setCurrentValue(nextValue);
		if (controller?.getFieldErrorMessage(name)) {
			controllerAction?.({ action: "cleanFieldError", fieldName: name });
		}
		onChange?.(e);
	}

	// default onBlur implementation for <FormInput>, important for every <FormInput> fields implementations
	function handleBlur(event: SyntheticEvent<HTMLInputElement>) {
		//handle errors and cleans them if field didn't meet specific criteria
		if (required && !event.currentTarget.value) {
			if (controllerAction) {
				controllerAction({
					action: "setFieldError",
					fieldName: name,
					error: { message: "Este campo precisa ser preenchido" },
				});
			}
		} else {
			if (controllerAction) {
				controllerAction({
					action: "cleanFieldError",
					fieldName: name,
				});
			}
		}
	}

	const elementLookup: Record<string, any> = {
		password: <PasswordInput />,
		select: <SelectInput />,
		search: <SearchInput />,
		checkbox: <CheckboxInput />,
	};

	// return DefaultWrapper;
	return (
		<FormInputContext
			value={{
				controller,
				input: {
					name,
					label,
					value,
					ValueFormatter,
					validator,
					type,
					disabled,
					labelAlign,
					placeholder,
					onChange,
					required,
					hideRequiredLabel,
					options,
					submitFormattedData,
					lettersOnly,
					maxLength,
				},
				events: {
					onChange: handleChange,
					onBlur: handleBlur,
				},
				basicInputParameters,
				revealed,
				setRevealed,
				labelAlign: labelAlignLookup[labelAlign],
				errorMessage,
				currentFormattedValue,
			}}
		>
			{elementLookup[type] ?? <GenericInput />}
		</FormInputContext>
	);
}

// const DefaultInputElement = (
// 	<input
// 		onChange={handleChange}
// 		onBlur={handleBlur}

// 		// onKeyUp={(e: any) => {
// 		// 	console.log(e.currentTarget.selectionStart);
// 		// }}

// 		{...basicInputParameters}
// 		id={name}
// 		type={type === "password" && revealed ? "text" : type}
// 		className="form-input"
// 	/>
// );

// let SelectedInputElement = DefaultInputElement;

// const DefaultLabelElement = label && (
// 	<label htmlFor={name}>
// 		{label}{" "}
// 		{!hideRequiredLabel && required && (
// 			<span className="text-hint-alert-dot">*</span>
// 		)}
// 	</label>
// );

// let DefaultErrorMessage = (
// 	<div className="text-sm text-hint-alert-dot">{errorMessage}</div>
// );

// let DefaultWrapper = (
// 	<div className={`flex ${labelAlignLookup[labelAlign]}`}>
// 		{DefaultLabelElement}
// 		{SelectedInputElement}
// 		{DefaultErrorMessage}
// 	</div>
// );

// reduce switch() for a lookup table if this gets too big
// switch (type) {
// 	case "time-range": {
// 		SelectedInputElement = (
// 			<div className="form-input flex flex-row justify-between w-fit gap-5">
// 				<input {...basicInputParameters} type="time" />
// 				<input {...basicInputParameters} type="time" />
// 			</div>
// 		);
// 		return DefaultWrapper;
// 	}

// 	case "checkbox": {
// 		SelectedInputElement = (
// 			<input
// 				{...basicInputParameters}
// 				type={"checkbox"}
// 				className="form-input input-checkbox"
// 			/>
// 		);
// 		return (
// 			<div className={`flex flex-row gap-2 items-center`}>
// 				{SelectedInputElement}
// 				{DefaultLabelElement}
// 				{DefaultErrorMessage}
// 			</div>
// 		);
// 	}

// 	case "password": {
// 		// reaproveita o input padrão (formatador, validação, controller) e só
// 		// troca o contorno: o wrapper vira o campo, o input fica "nu" dentro dele
// 		return (
// 			<div className={`flex ${labelAlignLookup[labelAlign]}`}>
// 				{DefaultLabelElement}
// 				<div className="form-input flex items-center gap-1 pr-1">
// 					{cloneElement(DefaultInputElement, { className: "w-full min-w-0" })}
// 					<button
// 						type="button"
// 						className="input-toggle"
// 						aria-label={revealed ? "Ocultar senha" : "Mostrar senha"}
// 						aria-pressed={revealed}
// 						onClick={() => setRevealed((r) => !r)}
// 					>
// 						<EyeIcon off={revealed} />
// 					</button>
// 				</div>
// 				{DefaultErrorMessage}
// 			</div>
// 		);
// 	}

// 	case "search": {
// 		return (
// 			<div className="form-input flex flex-row gap-3 items-center">
// 				{/*<img src="/icons/search.svg" className="size-5" />*/}
// 				<Search />
// 				<input
// 					{...basicInputParameters}
// 					type="search"
// 					className="w-full"
// 					onChange={handleChange}
// 				/>
// 			</div>
// 		);
// 	}

// 	case "select": {
// 		SelectedInputElement = (
// 			<select name={name} className="form-input">
// 				{options &&
// 					Object.entries(options).map(([label, value], idx) => (
// 						<option
// 							key={idx}
// 							value={value}
// 							selected={value === currentFormattedValue}
// 						>
// 							{label}
// 						</option>
// 					))}
// 			</select>
// 		);
// 		DefaultWrapper = (
// 			<div className="flex flex-col">
// 				{DefaultLabelElement}
// 				{SelectedInputElement}
// 				{DefaultErrorMessage}
// 			</div>
// 		);
// 		return DefaultWrapper;
// 	}
// }

// function EyeIcon({ off }: { off?: boolean }) {
// 	// return (
// 	{
// 		/*<svg
// 			width="18"
// 			height="18"
// 			viewBox="0 0 20 20"
// 			fill="none"
// 			stroke="currentColor"
// 			strokeWidth="1.6"
// 			strokeLinecap="round"
// 			strokeLinejoin="round"
// 			aria-hidden
// 		>
// 			<path d="M1.5 10s3-5.5 8.5-5.5S18.5 10 18.5 10 15.5 15.5 10 15.5 1.5 10 1.5 10Z" />
// 			<circle cx="10" cy="10" r="2.5" />
// 			{off && <path d="M3.5 3.5l13 13" />}
// 		</svg>
// 	);*/
// 	}
// 	return off ? <Eye /> : <EyeClosed />;
// }
