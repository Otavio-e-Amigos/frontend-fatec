import Header from "~/layouts/Header";
import type Professor from "~/modules/professor/professor.class";
import SaveProfessorForm from "../@layouts/SaveProfessorForm";

export default function EditPage({ professor }: { professor: Professor }) {

	return (
		<main className="flex flex-1 flex-col">
			<Header activeItem="Professores" />

			<div className="m-5">
				<SaveProfessorForm professor={professor} />
			</div>
		</main>
	);
}
