import type { SyntheticEvent } from "react";
import { useNavigate } from "react-router";
import FormController from "~/components/forms/FormController";
import Header from "~/layouts/Header";
import type Curso from "~/modules/curso/curso.class";
import save from "~/modules/professor/actions/save.action";
import SaveCourseForm from "./@layouts/SaveSubjectForm";
import Disciplina from '~/modules/disciplina/disciplina.class';

export default function Page({  disciplina }: { disciplina?: Disciplina }) {
	const navigate = useNavigate();
	const controller = new FormController();

	const formMode = disciplina ? "edit" : "add";

	const submit = async (e: SyntheticEvent<HTMLFormElement>) => {
		const res = await save(e, formMode, controller, disciplina?.id);
		if (res) {
			navigate("/disciplina");
		}
	};

	if (disciplina) {
		// REFLECT i think i could transform those lines workflow into a single mapper function
		controller.addField("turno", disciplina.cod);
		controller.addField("sigla", disciplina.acronym);
		controller.addField("nome", disciplina.name);

	}

	const editMode = formMode === "edit" ? true : false;
	// TODO turn this into a PageComponent?
	return (
		<main className="flex flex-1 flex-col">
			<Header activeItem="Professores" />

			{disciplina && (
				<h1 className="text-4xl my-5 mx-2">Editar dados de {disciplina.name}</h1>
			)}

			<SaveCourseForm
				controller={controller}
				submit={submit}
				edit={editMode}
			/>
		</main>
	);
}
