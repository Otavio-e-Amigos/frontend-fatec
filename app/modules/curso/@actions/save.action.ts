import type { FormSubmitEventHandlerProps } from "~/hooks/useForm";
import AuthService from "~/modules/user/auth.service";
import Curso from "../curso.class";
import CursoService from "../curso.service";
import { FormValidationError } from "~/classes/errors/ValidationError";

async function action({
	event,
	extras,
}: FormSubmitEventHandlerProps) {
	event.preventDefault();
	const form = Object.fromEntries(new FormData(event.currentTarget));
	const curso = new Curso({
		id: extras.id,
		nome: form.nome as string,
		turno: form.turno as string,
		sigla: form.sigla as string,
	});

	const auth = AuthService.getUserToken();
	const res = extras.id
		? await CursoService.edit(extras.id, curso, auth)
		: await CursoService.save(curso, auth);
}

async function onSuccess({ navigate }: FormSubmitEventHandlerProps) {
	navigate("/curso");
}

async function onFailure({ error, dispatch }: FormSubmitEventHandlerProps) {
	console.log(error);
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
