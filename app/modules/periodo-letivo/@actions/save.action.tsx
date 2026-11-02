import type { FormSubmitEventHandlerProps } from "~/hooks/useForm";
import PeriodoLetivoService from "../periodo-letivo.service";
import AuthService from "~/modules/user/auth.service";
import { FormValidationError } from "~/classes/errors/ValidationError";
import { FormCancelledError } from "~/classes/errors/FormCancelledError";
import { ApiUnavailableError } from "~/classes/errors/ApiUnavailableError";
import getErrorMessage from "~/classes/errors/get-error-message";
import ConfirmationWindowAction from "~/layouts/windows/actions/Confirmation.window-action";
import BasicWindow from "~/layouts/windows/BasicWindow";
import { PeriodoLetivoGenericSaveFailedToast, PeriodoLetivoSavedToast, PeriodoLetivoUpdatedToast } from "../periodo-letivo.toasts";

type PeriodoExtras = { id?: number; onSaved?: () => void };

async function action({
	event,
	extras,
	window
}: FormSubmitEventHandlerProps<PeriodoExtras>) {
	event.preventDefault();
	const data = Object.fromEntries(new FormData(event.currentTarget));
	const ano = Number(data.ano);
	const semestre = Number(data.semestre);
	const dataInicio = String(data.dataInicio ?? "");
	const dataFim = String(data.dataFim ?? "");
	const fields = [];

	if (!Number.isInteger(ano) || ano < 2000 || ano > 2100) {
		fields.push({ name: "ano", message: "Informe um ano entre 2000 e 2100." });
	}
	if (semestre !== 1 && semestre !== 2) {
		fields.push({ name: "semestre", message: "Selecione o semestre." });
	}
	if (!dataInicio)
		fields.push({ name: "dataInicio", message: "Informe a data inicial." });
	if (!dataFim)
		fields.push({ name: "dataFim", message: "Informe a data final." });
	if (dataInicio && dataFim && dataFim <= dataInicio) {
		fields.push({
			name: "dataFim",
			message: "A data final deve ser posterior à inicial.",
		});
	}

	if (fields.length > 0) {
		throw new FormValidationError(
			"Verifique os campos do período letivo.",
			fields,
		);
	}

	if (extras.id) {
		console.log("confirm");
		const confirmed = await window?.confirmExtra(
			{
				title: "Salvar alterações?",
				description: `As alterações no período ${ano}/${semestre} serão aplicadas.`,
				dismissible: true,
				actions: <ConfirmationWindowAction idleState={"Editar"} />,
			},
			<BasicWindow />,
		);
		if (!confirmed) throw new FormCancelledError();
	}

	// O service decide entre criar e editar pela presença do id.
	const periodo = { id: extras.id, semestre, ano, dataInicio, dataFim };
	await PeriodoLetivoService.save(periodo, AuthService.getUserToken());
}

async function onSuccess({
	navigate,
	toast,
	extras,
}: FormSubmitEventHandlerProps<PeriodoExtras>) {
	toast?.push(extras.id ? PeriodoLetivoUpdatedToast : PeriodoLetivoSavedToast);

	if (extras.onSaved) extras.onSaved();
	else navigate("/periodo-letivo");
}

async function onFailure({
	error,
	dispatch,
	toast
}: FormSubmitEventHandlerProps<PeriodoExtras>) {
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
		toast?.push({ tone: "error", message: error.message });

		return;
	}
	if (error instanceof ApiUnavailableError) return;
	const genericErrorToast = PeriodoLetivoGenericSaveFailedToast;
	const errorMessage = getErrorMessage(error, genericErrorToast.message);
	toast?.push(
		errorMessage !== genericErrorToast.message
			? { tone: "error", message: errorMessage }
			: genericErrorToast,
	);
}

export default { action, onSuccess, onFailure };
