import Header from "~/layouts/Header";
import type Disciplina from "~/modules/disciplina/disciplina.class";
import SaveDisciplinaForm from "../@layouts/SaveDisciplinaForm";

export default function EditDisciplinaPage({
	disciplina,
}: {
	disciplina: Disciplina;
}) {
	return (
		<main className="flex flex-1 flex-col">
			<Header activeItem="Disciplinas" />

			<div className="m-5">
				<SaveDisciplinaForm disciplina={disciplina} />
			</div>
		</main>
	);
}
