import {
	useReducer,
} from "react";
import { Form } from "react-router";
import FormController from "~/components/forms/FormController";
import {
	FormControllerContext,
	FormDispatcherContext,
	formReducer,
} from "./FormContext";

type SubmitEventHandlerController<T> = (
	event: React.SubmitEvent<T>,
	controller: FormController,
	dispatch: typeof formReducer,
) => void;

type FormContainerProps = {
	initialController?: FormController;
	children?: any;
	className?: string;
	onSubmit?: SubmitEventHandlerController<HTMLFormElement>;
};

export default function FormContainer({
	initialController,
	children,
	className,
	onSubmit,
}: FormContainerProps) {
	const [controller, dispatch] = useReducer(
		formReducer,
		initialController ? initialController : new FormController(),
	);

	const formProps = { className,
	};

	return (
		<Form {...formProps} onSubmit={(e) => {if (onSubmit) onSubmit(e, controller, formReducer)}}>
			<FormControllerContext value={controller}>
				<FormDispatcherContext value={dispatch}>
					{children}
				</FormDispatcherContext>
			</FormControllerContext>
		</Form>
	);
}
