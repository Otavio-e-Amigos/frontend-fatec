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
	const ano = Number(data.ano);
	const semestre = Number(data.semestre);
	const dataInicio = String(data.dataInicio ?? "");
	const dataFim = String(data.dataFim ?? "");
	const fields = [];

	if (!Number.isInteger(ano) || ano < 2000 || ano > 2100) {
		fields.push({ name: "ano", message: "Informe um ano entre 2000 e 2100." });
	}
	if (semestre !== 1 && semestre !== 2) {
		fields.push({ name: "semestre", message: "Selecione o semestre." });
	}
	if (!dataInicio) fields.push({ name: "dataInicio", message: "Informe a data inicial." });
	if (!dataFim) fields.push({ name: "dataFim", message: "Informe a data final." });
	if (dataInicio && dataFim && dataFim <= dataInicio) {
		fields.push({ name: "dataFim", message: "A data final deve ser posterior à inicial." });
	}

	if (fields.length > 0) {
		throw new FormValidationError("Verifique os campos do período letivo.", fields);
	}

	// Note: edit is handled via save with id parameter
	const periodo = {
		id: extras.id,
		semestre,
		ano,
		dataInicio,
		dataFim,
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
		error.fields.forEach((field) =>
			dispatch({
				action: "setFieldError",
				fieldName: field.name,
				error: { message: field.message },
			}),
		);
		if (error.message) {
			dispatch({
				action: "setError",
				error: { message: error.message },
			});
		}
	}
}

export default {
	action,
	onSuccess,
	onFailure,
};
