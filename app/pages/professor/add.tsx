import { Form } from "react-router"
import FormInput from "~/components/forms/FormInput"
import Header from "~/layouts/Header"
import Professor from "~/modules/professor/professor.class"

export default function Page() {
	return (
		<main className="flex flex-1 flex-col">
			<Header activeItem="Professores" />

			<Form className="w-fit">
				<FormInput name={"name"} label="Docente" type="text"/>
			</Form>
		</main>
	)
}
