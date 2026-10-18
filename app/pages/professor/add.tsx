// import { useNavigate } from "react-router";
import Header from "~/layouts/Header";
import Professor from "~/modules/professor/professor.class";
// import FormController from "../../components/forms/FormController";
// import { useEffect, useState, type SyntheticEvent } from "react";
// import save from "~/modules/professor/actions/save.action";
// import saveProfessor from "~/modules/professor/@actions/save.action"
import SaveProfessorForm from "./@layouts/SaveProfessorForm";
// import useForm from "~/hooks/useForm";

export default function Page({ professor }: { professor?: Professor }) {
	// const navigate = useNavigate();
	// const [controller] = useState(new FormController());

	// const formMode = professor ? "edit" : "add";

	// const submit = async (e: SyntheticEvent<HTMLFormElement>) => {
	// 	const res = await save(e, formMode, controller, professor?.id);
	// 	if (res) {
	// 		navigate("/professor");
	// 	}
	// };

	// useEffect(() => {console.log(controller)}, [controller])

	// const editMode = formMode === "edit" ? true : false;
	// TODO turn this into a PageComponent?
	return (
		<main className="flex flex-1 flex-col">
			<Header activeItem="Professores" />

			{/*<h1 className="text-4xl my-5 mx-2">Adicionar novo professor</h1>*/}

			<SaveProfessorForm
			// professor={professor}
			// controller={controller}
			// submit={submit}
			// edit={editMode}
			/>
		</main>
	);
}
