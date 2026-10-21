import type { FormSubmitEventHandlerProps } from "~/hooks/useForm";
import PeriodoLetivoService from "../periodo-letivo.service";
import AuthService from "~/modules/user/auth.service";
import { FormValidationError } from "~/classes/errors/ValidationError";
import { FormCancelledError } from "~/classes/errors/FormCancelledError";
import { ApiUnavailableError } from "~/classes/errors/ApiUnavailableError";
import getErrorMessage from "~/classes/errors/get-error-message";

type PeriodoExtras = { id?: number; onSaved?: () => void };

async function action({
	event,
	extras,
	dialogs,
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
	if (!dataInicio) fields.push({ name: "dataInicio", message: "Informe a data inicial." });
	if (!dataFim) fields.push({ name: "dataFim", message: "Informe a data final." });
	if (dataInicio && dataFim && dataFim <= dataInicio) {
		fields.push({ name: "dataFim", message: "A data final deve ser posterior à inicial." });
	}

	if (fields.length > 0) {
		throw new FormValidationError("Verifique os campos do período letivo.", fields);
	}

	if (extras.id) {
		const confirmed = await dialogs.confirm({
			title: "Salvar alterações?",
			description: `As alterações no período ${ano}/${semestre} serão aplicadas.`,
			confirmLabel: "Salvar",
			tone: "primary",
		});
		if (!confirmed) throw new FormCancelledError();
	}

	// O service decide entre criar e editar pela presença do id.
	const periodo = { id: extras.id, semestre, ano, dataInicio, dataFim };
	await PeriodoLetivoService.save(periodo, AuthService.getUserToken());
}

async function onSuccess({
	navigate,
	dialogs,
	extras,
}: FormSubmitEventHandlerProps<PeriodoExtras>) {
	dialogs.toast.success(
		extras.id
			? "Período letivo atualizado com sucesso."
			: "Período letivo cadastrado com sucesso.",
	);
	if (extras.onSaved) extras.onSaved();
	else navigate("/periodo-letivo");
}

async function onFailure({
	error,
	dispatch,
	dialogs,
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
		dialogs.toast.error(error.message);
		return;
	}
	if (error instanceof ApiUnavailableError) return;
	dialogs.toast.error(
		getErrorMessage(error, "Não foi possível salvar o período letivo."),
	);
}

export default { action, onSuccess, onFailure };