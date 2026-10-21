import { useState } from "react";
import CPFFormatter from "~/classes/ValueFormatters/CPFFormatter";
import NameFormatter from "~/classes/ValueFormatters/NameFormatter";
import FormController from "~/components/forms/FormController";
import FormInput from "~/components/forms/FormInput";
import useForm from "~/hooks/useForm";
import BasicFormLayout from "~/layouts/forms/BasicFormLayout";
import FormSection from "~/layouts/forms/FormSection";
import saveAction from "~/modules/user/@actions/save.action";
import type User from "~/modules/user/user.class";

function createInitialController(user?: User) {
	const controller = new FormController();
	if (!user) return controller;

	// controller.addField("nome", user.name);
	// controller.addField("cpf", user.cpf);
	// controller.addField("matricula", user.registry);
	// controller.addField("regimeContrato", user.contract);
	// controller.addField("status", user.status);
	// controller.addField("codigo", user.code);
	// controller.addField("titulacao", user.title);
	return controller;
}

export default function SaveUserForm({
	user,
}: {
	user?: User;
}) {
	const [initialController] = useState(() =>
		createInitialController(user),
	);
	const [submitError, setSubmitError] = useState("");
	const { FormContainer, isSubmitting } = useForm({
		actions: saveAction,
		actionsExtras: {
			id: user?.id,
			setSubmitError,
		},
	});
	const edit = user !== undefined;

	return (
		<BasicFormLayout
			title={
				user
					? `Editar Usuário "${user?.name}"`
					: `Cadastrar novo Usuário`
			}
			description={
				"Preencha as informações requeridas para realizar um cadastro de um novo usuário para o sistema."
			}
			Form={FormContainer}
		>
			<FormSection
				section="Informações básicas"
				description="Informações do usuário que acessará o sistema."
			>
				<FormInput
					required
					name="user"
					type="text"
					label="Usuário"
					value={user?.name ?? user?.login ?? ""}
				/>
				<FormInput
					required
					name="pass"
					type="password"
					label={user ? "Nova senha" : "Senha"}
					value=""
				/>
				<FormInput
					required
					name="profile"
					type="select"
					label="Perfil de usuário"
					options={{
						TI: "TI",
						Responsável: "RESPONSAVEL",
					}}
					value={user?.profile ?? "TI"}
				/>
			</FormSection>
			{submitError && (
				<p className="mb-4 text-sm text-danger-fg" role="alert">
					{submitError}
				</p>
			)}
			{/*<p className="text-hint-alert-dot w-full text-right">
				{controller.error?.message}
			</p>*/}
			<button type="submit" className="flex btn btn-success">
				{edit ? "Salvar Alterações" : "Adicionar"}
			</button>
		</BasicFormLayout>
	);
}

// REFLECT i think i can use hidden value inputs for managing states between formatted value objects,
// 				or i could just go object-based on FormController

// 			<input type="hidden" disabled name="disabled_value_shouldnt_be_here" value={"i believe this value shouldn't appear on console log since it's disabled?"}/>
