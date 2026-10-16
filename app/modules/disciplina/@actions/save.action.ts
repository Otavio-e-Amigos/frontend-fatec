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
	const nome = String(form.nome ?? "").trim();
	const codigo = String(form.codigo ?? "").trim();
	const sigla = String(form.sigla ?? "").trim().toUpperCase();
	const fields = [];

	if (!nome) fields.push({ name: "nome", message: "Informe o nome da disciplina." });
	else if (!/^[\p{L}\s.'-]+$/u.test(nome)) {
		fields.push({ name: "nome", message: "O nome não pode conter números." });
	}
	if (!codigo) fields.push({ name: "codigo", message: "Informe o código da disciplina." });
	else if (!/^[A-Za-z0-9-]+$/.test(codigo)) {
		fields.push({ name: "codigo", message: "Use apenas letras, números e hífen no código." });
	}
	if (!sigla) fields.push({ name: "sigla", message: "Informe a sigla da disciplina." });
	else if (!/^[A-Z]{2,10}$/.test(sigla)) {
		fields.push({ name: "sigla", message: "A sigla deve ter de 2 a 10 letras." });
	}

	if (fields.length > 0) {
		throw new FormValidationError("Verifique os campos da disciplina.", fields);
	}

	const disciplina = new Disciplina({
		id,
		nome,
		codigo,
		sigla,
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
		error.fields.forEach((field) =>
			dispatch({
				action: "setFieldError",
				fieldName: field.name,
				error: { message: field.message },
			}),
		);
	}
}

export default {
	action,
	onSuccess,
	onFailure,
};
