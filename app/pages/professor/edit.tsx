import Header from "~/layouts/Header";
import type Professor from "~/modules/professor/professor.class";
import SaveProfessorForm from "./@layouts/SaveProfessorForm";
import FormController from "~/components/forms/FormController";
import type { SyntheticEvent } from "react";
import { useNavigate } from "react-router";
import save from "~/modules/professor/actions/save.action";

export default function EditPage({ professor }: { professor: Professor }) {
	const navigate = useNavigate();
	const controller = new FormController();

	const submit = async (e: SyntheticEvent<HTMLFormElement>) => {
		const res = await save(e, "edit", controller, professor?.id);
		if (res) {
			navigate("/professor");
		}
	};

	// REFLECT i think i could transform those lines workflow into a single mapper function
	controller.addField("nome", professor.name);
	controller.addField("cpf", professor.cpf);

	controller.addField("matricula", professor.registry);
	controller.addField("regimeContrato", professor.contract);
	controller.addField("status", professor.status);
	controller.addField("codigo", professor.code);
	controller.addField("titulacao", professor.title);

	return (
		<main className="flex flex-1 flex-col">
			<Header activeItem="Professores" />

			{professor && (
				<h1 className="text-4xl my-5 mx-2">Editar dados de {professor.name}</h1>
			)}

			<SaveProfessorForm controller={controller} submit={submit} edit={true} />
		</main>
	);
}
