// import { type SyntheticEvent } from "react";
import ProfessorService from "../professor.service";
import { FormValidationError } from "~/classes/errors/ValidationError";
// import type FormController from "~/components/forms/FormController";
// import { type FormReducerAction } from "~/components/forms/FormContext";
// import { type NavigateFunction } from "react-router";
import type { FormSubmitEventHandlerProps } from "~/hooks/useForm";
import type { ProfessorInterface } from "../professor.class";
import AuthService from "~/modules/user/auth.service";
import { Form } from "react-router";
// import { FormSubmitEventHandler } from "~/hooks/useForm";

type professorExtras = { id?: number };

// let newProf =
const newData: {
	newId?: number;
} = { newId: undefined };

async function action({
	event,
	extras,
}: FormSubmitEventHandlerProps<professorExtras>) {
	event.preventDefault();
	const data = Object.fromEntries(new FormData(event.currentTarget));
	console.log("data from form: ", data);

	// export form as plain object or class directly using mapper if viable
	const profRaw: ProfessorInterface = {
		name: data.nome as string,
		cpf: data.cpf as string,
		registry: data.matricula as string,
		contract: data.regimeContrato as string,
		status: data.status as string,
		title: data.titulacao as string,
		code: data.codigo as string,
		id: extras.id,
	};

	const auth = AuthService.getUserToken();
	const res = extras.id
		? await ProfessorService.edit(extras.id, profRaw, auth)
		: await ProfessorService.save(profRaw, auth);
	newData.newId = res.id as number;
}

async function onSuccess({ navigate }: FormSubmitEventHandlerProps) {
	navigate(newData.newId ? `/professor/${newData.newId}` : "/professor");
}

async function onFailure({ error, dispatch }: FormSubmitEventHandlerProps) {
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
