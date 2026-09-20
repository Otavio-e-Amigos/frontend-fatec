import { Form } from "react-router";
import FormContext from "./form.context";
import FormController from "~/pages/professor/FormController";

export default function FormContainer({controller, children, className }: {controller?:FormController, children?: any, className?:string }) {
	const formController = controller ?? new FormController()

	// console.log("formController")
	// console.log(controller)

	return (
		<Form onSubmit={(e) => {e.preventDefault()}} action="/" className={className}>
			<FormContext value={formController}>{children}</FormContext>
		</Form>
	);
}
