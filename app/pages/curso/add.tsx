import type { SyntheticEvent } from "react";
import { useNavigate } from "react-router";
import FormController from "~/components/forms/FormController";
import Header from "~/layouts/Header";
import type Curso from "~/modules/curso/curso.class";
import save from "~/modules/professor/actions/save.action";
import SaveCourseForm from "./@layouts/SaveCourseForm";

export default function Page({ curso }: { curso?: Curso }) {
	const navigate = useNavigate();
	const controller = new FormController();

	const formMode = curso ? "edit" : "add";

	const submit = async (e: SyntheticEvent<HTMLFormElement>) => {
		const res = await save(e, formMode, controller, curso?.id);
		if (res) {
			navigate("/curso");
		}
	};

	if (curso) {
		// REFLECT i think i could transform those lines workflow into a single mapper function
		controller.addField("nome", curso.name);
		controller.addField("turno", curso.shift);
		controller.addField("unidade", curso.unit);
		controller.addField("sigla", curso.acronym);
	}

	const editMode = formMode === "edit" ? true : false;
	// TODO turn this into a PageComponent?
	return (
		<main className="flex flex-1 flex-col">
			<Header activeItem="Professores" />

			{curso && (
				<h1 className="text-4xl my-5 mx-2">Editar dados de {curso.name}</h1>
			)}

			<SaveCourseForm
				controller={controller}
				submit={submit}
				edit={editMode}
			/>
		</main>
	);
}
