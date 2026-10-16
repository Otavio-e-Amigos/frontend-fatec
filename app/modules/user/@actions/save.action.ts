import { FormValidationError } from "~/classes/errors/ValidationError";
import type { FormSubmitEventHandlerProps } from "~/hooks/useForm";
import AuthService from "../auth.service";
import UserService from "../user.service";
import User from "../user.class";
import DefaultAPIData from "~/modules/api/modules/default/DefaultAPIData";

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
async function onSuccess({ navigate }: FormSubmitEventHandlerProps) {
	navigate("/system");
}

/** Maps field validation and API failures to visible form messages. */
async function onFailure({
	error,
	dispatch,
	extras,
}: FormSubmitEventHandlerProps<UserSaveExtras>) {
	if (error instanceof FormValidationError) {
		error.fields.forEach((field) =>
			dispatch({
				action: "setFieldError",
				fieldName: field.name,
				error: { message: field.message },
			}),
		);
		return;
	}

	const message =
		error instanceof DefaultAPIData
			? error.error?.message ||
				error.rawData?.mensagem ||
				"Não foi possível salvar o usuário."
			: error instanceof Error && error.message
				? error.message
				: "Não foi possível salvar o usuário.";
	extras.setSubmitError(String(message));
}

export default { action, onSuccess, onFailure };
