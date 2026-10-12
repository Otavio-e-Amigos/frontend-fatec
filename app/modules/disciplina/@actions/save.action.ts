// import { type SyntheticEvent } from "react";
// import ProfessorService from "../professor.service";
import { FormValidationError } from "~/classes/errors/ValidationError";
// import type FormController from "~/components/forms/FormController";
// import { type FormReducerAction } from "~/components/forms/FormContext";
// import { type NavigateFunction } from "react-router";
import type { FormSubmitEventHandlerProps } from "~/hooks/useForm";
// import type { ProfessorInterface } from "../professor.class";
import AuthService from "~/modules/user/auth.service";
// import { Form } from "react-router";
import Disciplina from "../disciplina.class";
import DisciplinaService from "../disciplina.service";
// import { FormSubmitEventHandler } from "~/hooks/useForm";

type disciplineExtras = { id?: number };

// let newProf =
const newData: {
	newId?: number;
} = { newId: undefined };

async function action({
	event,
	extras,
}: FormSubmitEventHandlerProps<disciplineExtras>) {
	event.preventDefault();
	const form = Object.fromEntries(new FormData(event.currentTarget));
	const { id } = extras;

	const disciplina = new Disciplina({
		id,
		nome: form.nome as string,
		codigo: form.codigo as string,
		sigla: form.sigla as string,
	});

	if (id) {
		newData.newId = id;
	}

	const auth = AuthService.getUserToken();
	const res = id
		? await DisciplinaService.edit(id, disciplina, auth)
		: await DisciplinaService.save(disciplina, auth);
}

async function onSuccess({ navigate }: FormSubmitEventHandlerProps) {
	navigate(newData.newId ? `/disciplina${/*/newData.newId*/ ""}` : "/disciplina");
}

async function onFailure({ error, dispatch }: FormSubmitEventHandlerProps) {
	console.log(error)
	if (error instanceof FormValidationError) {
		dispatch({
			action: "setError",
			error: { message: error.message },
		});
	}
}

export default {
	action,
	onSuccess,
	onFailure,
};
