import { useReducer } from "react";
import { Form } from "react-router";
import FormController from "~/components/forms/FormController";
import { FormControllerContext, FormDispatcherContext, formReducer } from "./form.context";

export default function FormContainer({ controller: initialController, children, className }: { controller?: FormController, children?: any, className?: string }) {
	const [controller, dispatch] = useReducer(formReducer, initialController ?? new FormController())

	return (
		<Form onSubmit={(e) => { e.preventDefault() }} action="/" className={className}>
			<FormControllerContext value={controller}>
				<FormDispatcherContext value={dispatch}>
					{children}
				</FormDispatcherContext>
			</FormControllerContext>
		</Form>
	);
}
