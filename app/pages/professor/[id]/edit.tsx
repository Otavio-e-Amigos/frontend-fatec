import Header from "~/layouts/Header";
import type Professor from "~/modules/professor/professor.class";
import SaveProfessorForm from "../@layouts/SaveProfessorForm";

export default function EditPage({ professor }: { professor: Professor }) {
	// // REFLECT i think i could transform those lines workflow into a single mapper function
	// controller.addField("nome", professor.name);
	// controller.addField("cpf", professor.cpf);

	// controller.addField("matricula", professor.registry);
	// controller.addField("regimeContrato", professor.contract);
	// controller.addField("status", professor.status);
	// controller.addField("codigo", professor.code);
	// controller.addField("titulacao", professor.title);

	return (
		<main className="flex flex-1 flex-col">
			<Header activeItem="Professores" />

			{/*<h1 className="text-4xl my-5 mx-2">Editar dados de {professor.name}</h1>*/}

			<div className="m-5">
				<SaveProfessorForm professor={professor} />
			</div>
		</main>
	);
}
