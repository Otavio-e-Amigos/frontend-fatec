// import { type SyntheticEvent } from "react";
import AuthService from "../auth.service";
import { FormValidationError } from "~/classes/errors/ValidationError";
// import type FormController from "~/components/forms/FormController";
// import { type FormReducerAction } from "~/components/forms/FormContext";
// import { type NavigateFunction } from "react-router";
import type { FormSubmitEventHandlerProps } from "~/hooks/useForm";
// import { FormSubmitEventHandler } from "~/hooks/useForm";

async function action({ event }: FormSubmitEventHandlerProps) {
	event.preventDefault();
	const data = Object.fromEntries(new FormData(event.currentTarget));
	const form = {
		login: String(data.user ?? "").trim(),
		senha: String(data.pass ?? ""),
	};

	const fields = [];
	if (!form.login) fields.push({ name: "user", message: "Informe seu usuário." });
	if (!form.senha) fields.push({ name: "pass", message: "Informe sua senha." });

	if (fields.length > 0) {
		throw new FormValidationError("Verifique os campos informados.", fields);
	}

	await AuthService.login(form.login, form.senha);
}

async function onSuccess({ navigate }: FormSubmitEventHandlerProps) {
	navigate("/");
}

async function onFailure({ error, dispatch }: FormSubmitEventHandlerProps) {
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
