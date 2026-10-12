import {
	cloneElement,
	useContext,
	useEffect,
	useMemo,
	useState,
	type SyntheticEvent,
} from "react";
import { FormControllerContext, FormDispatcherContext } from "./FormContext";
import { InputValidator } from "~/components/forms/FormController";
import AbstractValueFormatter, {
	type AbstractValueFormatterInterface,
	// type AdvancedAbstractValueFormatterReturn,
} from "~/classes/base/AbstractValueFormatter";

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
	hideRequiredLabel?: boolean;
	submitFormattedData?: boolean;
	options?: Record<string, string>;
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
}: FormInputProps) {
	const controller = useContext(FormControllerContext);
	const controllerAction = useContext(FormDispatcherContext);
	const [revealed, setRevealed] = useState(false); // usado só pelo type="password"
	const formatter =
		ValueFormatter && (ValueFormatter as AbstractValueFormatterInterface);
	const [errorMessage, setErrorMessage] = useState<string | undefined>("");

	const [cursorPosition, setCursorPosition] = useState<{
		start: number;
		end: number;
		inputElement: HTMLInputElement | undefined;
	}>({ start: 0, end: 0, inputElement: undefined });

	const [currentValue, setCurrentValue] = useState<any>("");
	// const [currentFormattedValue, setCurrentFormattedValue] = useMemo(() => { return ""}, [currentValue, formatter]);
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

	useEffect(() => {
		let overrideValue = value ?? controller?.getFieldValue(name) ?? "";
		if (!controller?.fieldExists(name))
			controller?.addField(name, overrideValue, { validator });

		setCurrentValue(overrideValue);
	}, []);

	useEffect(() => {
		if (cursorPosition.inputElement) {
			const element = cursorPosition.inputElement;
			controller?.setFieldValue(name, currentValue)
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
		console.log(controller)
	}, [currentValue]);

	const basicInputParameters = {
		name: name,
		disabled: disabled,
		placeholder: placeholder,
		// defaultValue: currentFormattedValue,
		value: currentFormattedValue,
		// onChange: onChange ?? undefined,
	};

	const DefaultInputElement = (
		<input
			onChange={(e: SyntheticEvent<HTMLInputElement>) => {
				let startCursorPosition = e.currentTarget.selectionStart ?? 0;
				let endCursorPosition = e.currentTarget.selectionEnd ?? 0;

				setCursorPosition({
					start: startCursorPosition,
					end: endCursorPosition,
					inputElement: e.currentTarget as any,
				});
				// console.log("before change", oldCursorPosition)

				const inputValue = e.currentTarget.value;
				setCurrentValue(
					formatter ? formatter.unformat(inputValue) : inputValue,
				);

				// e.currentTarget.selectionStart = oldCursorPosition
				// console.log("after change", oldCursorPosition)
			}}

			onKeyUp={(e: any) => {
				console.log(e.currentTarget.selectionStart);
			}}

			onBlur={(e) => {}}

			{...basicInputParameters}
			id={name}
			type={type === "password" && revealed ? "text" : type}
			className="form-input"
		/>
	);

	let SelectedInputElement = DefaultInputElement;

	const DefaultLabelElement = label && (
		<label htmlFor={name}>
			{label}{" "}
			{!hideRequiredLabel && required && (
				<span className="text-hint-warning">*</span>
			)}
		</label>
	);

	const labelAlignLookup = {
		top: "flex-col",
		left: "flex-row gap-2 items-center",
		right: "flex-row-reverse gap-2 items-center",
	};

	let DefaultErrorMessage = (
		<div className="text-sm text-hint-warning">{errorMessage}</div>
	);

	let DefaultWrapper = (
		<div className={`flex ${labelAlignLookup[labelAlign]}`}>
			{DefaultLabelElement}
			{SelectedInputElement}
			{DefaultErrorMessage}
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
					{DefaultErrorMessage}
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
					{DefaultErrorMessage}
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

		case "select": {
			SelectedInputElement = (
				<select name={name} className="form-input">
					{options &&
						Object.entries(options).map(([label, value], idx) => (
							<option key={idx} value={value} selected={value === currentFormattedValue}>
								{label}
							</option>
						))}
				</select>
			);
			DefaultWrapper = (
				<div className="flex flex-col">
					{DefaultLabelElement}
					{SelectedInputElement}
					{DefaultErrorMessage}
				</div>
			);
			return DefaultWrapper;
			// return (
			// 	<div className="flex flex-col">

			// 		<select name="titulacao" className="form-input">
			// 			<option value={"GRADUADO"} selected>
			// 				Graduado
			// 			</option>
			// 			<option value={"ESPECIALISTA"}>Especialista</option>
			// 			<option value={"MESTRE"}>Mestre</option>
			// 			<option value={"DOUTOR"}>Doutor</option>
			// 			<option value={"POS_DOUTOR"}>Pós Doutorado</option>
			// 		</select>
			// 	</div>
			// );
		}
	}

	return DefaultWrapper;
}
