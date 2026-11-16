import type { FormSubmitEventHandlerProps } from "~/hooks/useForm";
import CalendarioService from "../calendario.service";
import AuthService from "~/modules/user/auth.service";
import { FormValidationError } from "~/classes/errors/ValidationError";
import { ApiUnavailableError } from "~/classes/errors/ApiUnavailableError";
import getErrorMessage from "~/classes/errors/get-error-message";
import {
	EventoCalendarioGenericSaveFailedToast,
	EventoCalendarioSavedToast,
	EventoCalendarioUpdatedToast,
} from "../calendario.toasts";

// `data` só vem preenchido na edição (a data é o identificador e não pode mudar)
type EventoExtras = { data?: string; onSaved?: () => void };

async function action({ event, extras }: FormSubmitEventHandlerProps<EventoExtras>) {
	event.preventDefault();
	const form = Object.fromEntries(new FormData(event.currentTarget));
	const isEdit = Boolean(extras.data);

	// campo desabilitado não é enviado no FormData, então a data vem dos extras na edição
	const data = isEdit ? String(extras.data) : String(form.data ?? "");
	const descricao = String(form.descricao ?? "").trim();
	const tipo = String(form.tipo ?? "");
	const semAula = String(form.semAula ?? "true") === "true";
	const fields = [];

	if (!data) fields.push({ name: "data", message: "Informe a data." });
	if (!descricao)
		fields.push({ name: "descricao", message: "Informe a descrição do evento." });
	if (!tipo) fields.push({ name: "tipo", message: "Selecione o tipo." });

	if (fields.length > 0) {
		throw new FormValidationError("Verifique os campos do evento.", fields);
	}

	await CalendarioService.save(
		{ data, descricao, tipo, semAula },
		AuthService.getUserToken(),
		isEdit,
	);
}

async function onSuccess({ navigate, toast, extras }: FormSubmitEventHandlerProps<EventoExtras>) {
	toast?.push(extras.data ? EventoCalendarioUpdatedToast : EventoCalendarioSavedToast);

	if (extras.onSaved) extras.onSaved();
	else navigate("/calendario");
}

async function onFailure({ error, dispatch, toast }: FormSubmitEventHandlerProps<EventoExtras>) {
	if (error instanceof FormValidationError) {
		error.fields.forEach((field) =>
			dispatch({
				action: "setFieldError",
				fieldName: field.name,
				error: { message: field.message },
			}),
		);
		if (error.message) {
			dispatch({ action: "setError", error: { message: error.message } });
		}
		toast?.push({ tone: "error", message: error.message });
		return;
	}
	if (error instanceof ApiUnavailableError) return;

	const generic = EventoCalendarioGenericSaveFailedToast;
	const message = getErrorMessage(error, generic.message);
	toast?.push(message !== generic.message ? { tone: "error", message } : generic);
}

export default { action, onSuccess, onFailure };
