import type AbstractValueFormatter from "~/classes/base/AbstractValueFormatter";
import type { InputValidator } from "./FormController";
import type FormController from "./FormController";

export type FormInputTypesSupported =
	React.HTMLInputTypeAttribute | "time-range" | "select";

export type FormInputProps = {
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
	lettersOnly?: boolean;
	maxLength?: number;
};

export type FormInputContextProvider = {
	controller?: FormController | null;
	input?: FormInputProps;
	events?: {
		onChange?: any;
		onBlur?: any;
	};
	basicInputParameters?: any;
	revealed?: any;
	setRevealed?: any;
	// DefaultLabelElement?: any,
	labelAlign?: any;
	errorMessage?: string;
	currentFormattedValue?: any;
};

export type InputElementCursorPositionState = {
	start: number;
	end: number;
	inputElement: HTMLInputElement | undefined;
};
