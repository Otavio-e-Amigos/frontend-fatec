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
	const name = String(data.nome ?? "").trim();
	const cpf = String(data.cpf ?? "").replace(/\D/g, "");
	const registry = String(data.matricula ?? "").trim();
	const contract = String(data.regimeContrato ?? "");
	const status = String(data.status ?? "");
	const title = String(data.titulacao ?? "");
	const code = String(data.codigo ?? "").trim();
	const fields = [];

	if (!name) fields.push({ name: "nome", message: "Informe o nome completo." });
	else if (!/^[\p{L}\s.'-]+$/u.test(name)) {
		fields.push({ name: "nome", message: "O nome não pode conter números." });
	}
	if (!/^\d{11}$/.test(cpf)) {
		fields.push({ name: "cpf", message: "Informe um CPF com 11 dígitos." });
	}
	if (registry.length < 5) {
		fields.push({ name: "matricula", message: "A matrícula deve ter ao menos 5 caracteres." });
	}
	if (!["DETERMINADO", "INDETERMINADO", "TEMPORARIO"].includes(contract)) {
		fields.push({ name: "regimeContrato", message: "Selecione um contrato válido." });
	}
	if (!["ATIVO", "INATIVO", "AFASTADO"].includes(status)) {
		fields.push({ name: "status", message: "Selecione um status válido." });
	}
	if (!["GRADUADO", "ESPECIALISTA", "MESTRE", "DOUTOR", "POS_DOUTOR"].includes(title)) {
		fields.push({ name: "titulacao", message: "Selecione uma titulação válida." });
	}
	if (fields.length > 0) {
		throw new FormValidationError("Verifique os campos do docente.", fields);
	}

	// export form as plain object or class directly using mapper if viable
	const profRaw: ProfessorInterface = {
		name,
		cpf,
		registry,
		contract,
		status,
		title,
		code,
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
