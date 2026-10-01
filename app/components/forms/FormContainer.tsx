import { useReducer, type SubmitEventHandler } from "react";
import { Form } from "react-router";
import FormController from "~/components/forms/FormController";
import {
	FormControllerContext,
	FormDispatcherContext,
	formReducer,
} from "./FormContext";

type FormContainerProps = {
	initialController?: FormController;
	children?: any;
	className?: string;
	onSubmit?: SubmitEventHandler<HTMLFormElement>;
	action?: string;
};

export default function FormContainer({
	initialController,
	children,
	className,
	onSubmit,
	action,
}: FormContainerProps) {
	const [controller, dispatch] = useReducer(
		formReducer,
		initialController ?? new FormController(),
	);

	const formProps = { className, onSubmit, action };

	return (
		<Form {...formProps}>
			<FormControllerContext value={controller}>
				<FormDispatcherContext value={dispatch}>
					{children}
				</FormDispatcherContext>
			</FormControllerContext>
		</Form>
	);
}
