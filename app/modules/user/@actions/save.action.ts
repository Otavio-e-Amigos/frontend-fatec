import { FormValidationError } from "~/classes/errors/ValidationError";
import { FormCancelledError } from "~/classes/errors/FormCancelledError";
import { ApiUnavailableError } from "~/classes/errors/ApiUnavailableError";
import getErrorMessage from "~/classes/errors/get-error-message";
import type { FormSubmitEventHandlerProps } from "~/hooks/useForm";
import AuthService from "../auth.service";
import UserService from "../user.service";
import User from "../user.class";

type UserSaveExtras = {
	id?: number;
	setSubmitError: (message: string) => void;
};

type UserProfile = "TI" | "RESPONSAVEL";

/** Validates a submitted profile and returns it as a supported API value. */
function getUserProfile(value: string): UserProfile {
	if (value === "TI" || value === "RESPONSAVEL") return value;
	throw new FormValidationError("Verifique o perfil do usuário.", [
		{ name: "profile", message: "Selecione um perfil válido." },
	]);
}

/** Validates and persists a system user using the shared form lifecycle. */
async function action({
	event,
	extras,
	dialogs,
}: FormSubmitEventHandlerProps<UserSaveExtras>) {
	event.preventDefault();
	extras.setSubmitError("");

	const values = Object.fromEntries(new FormData(event.currentTarget));
	const name = String(values.user ?? "").trim();
	const password = String(values.pass ?? "");
	const profile = String(values.profile ?? "");
	const fields = [];

	if (!name) fields.push({ name: "user", message: "Informe o nome do usuário." });
	if (!password) fields.push({ name: "pass", message: "Informe a senha." });
	if (fields.length) {
		throw new FormValidationError("Verifique os campos informados.", fields);
	}
	const userProfile = getUserProfile(profile);

	// Confirmação apenas na edição, depois que a validação passou.
	if (extras.id) {
		const confirmed = await dialogs.confirm({
			title: "Salvar alterações?",
			description: `As alterações no usuário ${name} serão aplicadas e a senha será atualizada.`,
			confirmLabel: "Salvar",
			tone: "primary",
		});
		if (!confirmed) throw new FormCancelledError();
	}

	const user = new User({
		id: extras.id,
		name,
		password,
		profile: userProfile,
	});
	const auth = AuthService.getUserToken();

	if (extras.id) await UserService.edit(extras.id, user, auth);
	else await UserService.save(user, auth);
}

/** Returns to the system user list after a successful save. */
async function onSuccess({
	navigate,
	dialogs,
	extras,
}: FormSubmitEventHandlerProps<UserSaveExtras>) {
	dialogs.toast.success(
		extras.id
			? "Usuário atualizado com sucesso."
			: "Usuário cadastrado com sucesso.",
	);
	navigate("/system");
}

/** Maps field validation and API failures to visible form messages. */
async function onFailure({
	error,
	dispatch,
	extras,
	dialogs,
}: FormSubmitEventHandlerProps<UserSaveExtras>) {
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

	// Quando a API não responde, o banner no topo já avisa o usuário.
	if (error instanceof ApiUnavailableError) return;

	const message = getErrorMessage(error, "Não foi possível salvar o usuário.");
	extras.setSubmitError(message);
	dialogs.toast.error(message);
}

export default { action, onSuccess, onFailure };