import { FormValidationError } from "~/classes/errors/ValidationError";
import { FormCancelledError } from "~/classes/errors/FormCancelledError";
import { ApiUnavailableError } from "~/classes/errors/ApiUnavailableError";
import getErrorMessage from "~/classes/errors/get-error-message";
import type { FormSubmitEventHandlerProps } from "~/hooks/useForm";
import AuthService from "~/modules/user/auth.service";
import Disciplina from "../disciplina.class";
import DisciplinaService from "../disciplina.service";

type DisciplinaExtras = { id?: number; onSaved?: () => void };

async function action({
	event,
	extras,
	dialogs,
}: FormSubmitEventHandlerProps<DisciplinaExtras>) {
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

	if (id) {
		const confirmed = await dialogs.confirm({
			title: "Salvar alterações?",
			description: `As alterações na disciplina ${nome} serão aplicadas.`,
			confirmLabel: "Salvar",
			tone: "primary",
		});
		if (!confirmed) throw new FormCancelledError();
	}

	const disciplina = new Disciplina({ id, nome, codigo, sigla });
	const auth = AuthService.getUserToken();
	if (id) {
		await DisciplinaService.edit(id, disciplina, auth);
	} else {
		await DisciplinaService.save(disciplina, auth);
	}
}

async function onSuccess({
	navigate,
	dialogs,
	extras,
}: FormSubmitEventHandlerProps<DisciplinaExtras>) {
	dialogs.toast.success(
		extras.id
			? "Disciplina atualizada com sucesso."
			: "Disciplina cadastrada com sucesso.",
	);
	if (extras.onSaved) extras.onSaved();
	else navigate("/disciplina");
}

async function onFailure({
	error,
	dispatch,
	dialogs,
}: FormSubmitEventHandlerProps<DisciplinaExtras>) {
	if (error instanceof FormValidationError) {
		error.fields.forEach((field) =>
			dispatch({
				action: "setFieldError",
				fieldName: field.name,
				error: { message: field.message },
			}),
		);
		dialogs.toast.error(error.message);
		return;
	}
	if (error instanceof ApiUnavailableError) return;
	dialogs.toast.error(
		getErrorMessage(error, "Não foi possível salvar a disciplina."),
	);
}

export default { action, onSuccess, onFailure };