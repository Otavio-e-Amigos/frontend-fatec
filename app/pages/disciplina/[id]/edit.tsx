// import { useNavigate } from "react-router";
import Header from "~/layouts/Header";
// import saveDisciplina from "~/modules/disciplina/actions/save.action";
import type Disciplina from "~/modules/disciplina/disciplina.class";
import SaveDisciplinaForm from "../@layouts/SaveDisciplinaForm";

export default function EditDisciplinaPage({
	disciplina,
}: {
	disciplina: Disciplina;
}) {
	// const navigate = useNavigate();
	return (
		<main className="flex flex-1 flex-col">
			<Header activeItem="Disciplinas" />
			{/*<h1 className="text-4xl my-5 mx-2">Editar disciplina</h1>*/}

			<div className="m-5">
				<SaveDisciplinaForm disciplina={disciplina} />
			</div>
		</main>
	);
}
