import type { FormSubmitEventHandlerProps } from "~/hooks/useForm";
import AuthService from "~/modules/user/auth.service";
import Curso from "../curso.class";
import CursoService from "../curso.service";
import { FormValidationError } from "~/classes/errors/ValidationError";
import { FormCancelledError } from "~/classes/errors/FormCancelledError";
import { ApiUnavailableError } from "~/classes/errors/ApiUnavailableError";
import getErrorMessage from "~/classes/errors/get-error-message";

type CursoExtras = { id?: number; onSaved?: () => void };

async function action({
	event,
	extras,
	dialogs,
}: FormSubmitEventHandlerProps<CursoExtras>) {
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

	if (extras.id) {
		const confirmed = await dialogs.confirm({
			title: "Salvar alterações?",
			description: `As alterações no curso ${nome} serão aplicadas.`,
			confirmLabel: "Salvar",
			tone: "primary",
		});
		if (!confirmed) throw new FormCancelledError();
	}

	const curso = new Curso({ id: extras.id, nome, turno, sigla });
	const auth = AuthService.getUserToken();
	if (extras.id) {
		await CursoService.edit(extras.id, curso, auth);
	} else {
		await CursoService.save(curso, auth);
	}
}

async function onSuccess({
	navigate,
	dialogs,
	extras,
}: FormSubmitEventHandlerProps<CursoExtras>) {
	dialogs.toast.success(
		extras.id
			? "Curso atualizado com sucesso."
			: "Curso cadastrado com sucesso.",
	);
	if (extras.onSaved) extras.onSaved();
	else navigate("/curso");
}

async function onFailure({
	error,
	dispatch,
	dialogs,
}: FormSubmitEventHandlerProps<CursoExtras>) {
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
		dialogs.toast.error(error.message);
		return;
	}
	if (error instanceof ApiUnavailableError) return;
	dialogs.toast.error(
		getErrorMessage(error, "Não foi possível salvar o curso."),
	);
}

export default { action, onSuccess, onFailure };