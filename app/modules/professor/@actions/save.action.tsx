import ProfessorService from "../professor.service";
import { FormValidationError } from "~/classes/errors/ValidationError";
import { FormCancelledError } from "~/classes/errors/FormCancelledError";
import { ApiUnavailableError } from "~/classes/errors/ApiUnavailableError";
import getErrorMessage from "~/classes/errors/get-error-message";
import type { FormSubmitEventHandlerProps } from "~/hooks/useForm";
import type { ProfessorInterface } from "../professor.class";
import AuthService from "~/modules/user/auth.service";
import ConfirmationWindowAction from "~/layouts/windows/actions/Confirmation.window-action";

// savedId é preenchido pela action e lido pelo onSuccess (mesmo objeto extras na submissão).
type ProfessorExtras = { id?: number; savedId?: number };

async function action({
	event,
	extras,
	dialogs,
	window,
}: FormSubmitEventHandlerProps<ProfessorExtras>) {
	event.preventDefault();
	const data = Object.fromEntries(new FormData(event.currentTarget));
	const name = String(data.nome ?? "").trim();
	const cpf = String(data.cpf ?? "").replace(/\D/g, "");
	const registry = String(data.matricula ?? "").trim();
	const contract = String(data.regimeContrato ?? "");
	const status = String(data.status ?? "");
	const title = String(data.titulacao ?? "");
	const code = String(data.codigo ?? "").trim();
	const fields = [];

	if (!name) fields.push({ name: "nome", message: "Informe o nome completo." });
	else if (!/^[\p{L}\s.'-]+$/u.test(name)) {
		fields.push({ name: "nome", message: "O nome não pode conter números." });
	}
	if (!/^\d{11}$/.test(cpf)) {
		fields.push({ name: "cpf", message: "Informe um CPF com 11 dígitos." });
	}
	if (registry.length < 5) {
		fields.push({
			name: "matricula",
			message: "A matrícula deve ter ao menos 5 caracteres.",
		});
	}
	if (!["DETERMINADO", "INDETERMINADO", "TEMPORARIO"].includes(contract)) {
		fields.push({
			name: "regimeContrato",
			message: "Selecione um contrato válido.",
		});
	}
	if (!["ATIVO", "INATIVO", "AFASTADO"].includes(status)) {
		fields.push({ name: "status", message: "Selecione um status válido." });
	}
	if (
		!["GRADUADO", "ESPECIALISTA", "MESTRE", "DOUTOR", "POS_DOUTOR"].includes(
			title,
		)
	) {
		fields.push({
			name: "titulacao",
			message: "Selecione uma titulação válida.",
		});
	}
	if (fields.length > 0) {
		throw new FormValidationError("Verifique os campos do docente.", fields);
	}

	// Confirmação apenas na edição, depois que a validação passou.
	// Se o usuário cancelar, o useForm ignora o erro e o formulário continua aberto.
	if (extras.id) {
		// let confirmed = false;
		window?.show({
			title: "Salvar alterações?",
			description: `As alterações no cadastro do docente ${name} serão aplicadas.`,
			dismissible: true,
			// tone: "primary",
			actions: <ConfirmationWindowAction idleState={"Editar"} />,
			extras: {
				onConfirm: () => {
					// confirmed = true;
					window.hide();
				},
			},
		});
		// const confirmed = await dialogs.confirm({
		// 	title: "Salvar alterações?",
		// 	description: `As alterações no cadastro do docente ${name} serão aplicadas.`,
		// 	confirmLabel: "Salvar",
		// 	tone: "primary",
		// });
		// if (!confirmed) throw new FormCancelledError();
		// throw new FormCancelledError();
	}

	// export form as plain object or class directly using mapper if viable
	const profRaw: ProfessorInterface = {
		name,
		cpf,
		registry,
		contract,
		status,
		title,
		code,
		id: extras.id,
	};

	const auth = AuthService.getUserToken();
	const res = extras.id
		? await ProfessorService.edit(extras.id, profRaw, auth)
		: await ProfessorService.save(profRaw, auth);
	extras.savedId = res.id as number;
}

async function onSuccess({
	navigate,
	dialogs,
	extras,
}: FormSubmitEventHandlerProps<ProfessorExtras>) {
	dialogs.toast.success(
		extras.id
			? "Professor atualizado com sucesso."
			: "Professor cadastrado com sucesso.",
	);
	const id = extras.savedId ?? extras.id;
	navigate(id ? `/professor/${id}` : "/professor");
}

async function onFailure({
	error,
	dispatch,
	dialogs,
}: FormSubmitEventHandlerProps<ProfessorExtras>) {
	console.log(error);

	if (error instanceof FormValidationError) {
		error.fields.forEach((field) =>
			dispatch({
				action: "setFieldError",
				fieldName: field.name,
				error: { message: field.message },
			}),
		);
		// A mensagem geral já aparece no próprio formulário (setError).
		if (error.message) {
			dispatch({
				action: "setError",
				error: { message: error.message },
			});
		}
		return;
	}

	// Quando a API não responde, o banner no topo já avisa o usuário.
	if (error instanceof ApiUnavailableError) return;

	dialogs.toast.error(
		getErrorMessage(error, "Não foi possível salvar o professor."),
	);
}

export default {
	action,
	onSuccess,
	onFailure,
};
