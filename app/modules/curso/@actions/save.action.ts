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
	const nome = String(form.nome ?? "").trim();
	const turno = String(form.turno ?? "");
	const sigla = String(form.sigla ?? "").trim().toUpperCase();
	const fields = [];

	if (!nome) fields.push({ name: "nome", message: "Informe o nome do curso." });
	else if (!/^[\p{L}\s.'-]+$/u.test(nome)) {
		fields.push({ name: "nome", message: "O nome não pode conter números." });
	}
	if (!["MANHA", "TARDE", "NOITE"].includes(turno)) {
		fields.push({ name: "turno", message: "Selecione um turno válido." });
	}
	if (!sigla) fields.push({ name: "sigla", message: "Informe a sigla do curso." });
	else if (!/^[A-Z]{2,10}$/.test(sigla)) {
		fields.push({ name: "sigla", message: "A sigla deve ter de 2 a 10 letras." });
	}

	if (fields.length > 0) {
		throw new FormValidationError("Verifique os campos do curso.", fields);
	}

	const curso = new Curso({
		id: extras.id,
		nome,
		turno,
		sigla,
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
