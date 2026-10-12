import type { FormSubmitEventHandlerProps } from "~/hooks/useForm";
import PeriodoLetivoService from "../periodo-letivo.service";
import User from "~/modules/user/user.class";
import AuthService from "~/modules/user/auth.service";
import { FormValidationError } from "~/classes/errors/ValidationError";

async function action({
	event,
	extras,
}: FormSubmitEventHandlerProps) {
	event.preventDefault();
	const data = Object.fromEntries(new FormData(event.currentTarget));

	// Note: edit is handled via save with id parameter
	const periodo = {
		id: extras.id,
		semestre: Number(data.semestre),
		ano: Number(data.ano),
		dataInicio: data.dataInicio as string,
		dataFim: data.dataFim as string,
	};

	const auth = AuthService.getUserToken();
	const res = await PeriodoLetivoService.save(periodo, auth);
}

async function onSuccess({ navigate }: FormSubmitEventHandlerProps) {
	navigate("/periodo-letivo");
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
