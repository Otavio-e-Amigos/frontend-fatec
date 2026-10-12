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
	console.log(event);
	const data = Object.fromEntries(new FormData(event.currentTarget));
	console.log(data);
	const form = {
		login: data.user as string,
		senha: data.pass as string,
	};

	console.log(form);
	const loggedIn = await AuthService.login(form.login, form.senha);
}

async function onSuccess({ navigate }: FormSubmitEventHandlerProps) {
	navigate("/");
}

async function onFailure({ error, dispatch }: FormSubmitEventHandlerProps) {
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
