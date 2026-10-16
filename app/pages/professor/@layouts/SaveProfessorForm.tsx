import { useState } from "react";
import CPFFormatter from "~/classes/ValueFormatters/CPFFormatter";
import NameFormatter from "~/classes/ValueFormatters/NameFormatter";
import FormController from "~/components/forms/FormController";
import FormInput from "~/components/forms/FormInput";
import useForm from "~/hooks/useForm";
import FormSection from "~/layouts/forms/FormSection";
import saveAction from "~/modules/professor/@actions/save.action";
import type Professor from "~/modules/professor/professor.class";

function createInitialController(professor?: Professor) {
	const controller = new FormController();
	if (!professor) return controller;

	controller.addField("nome", professor.name);
	controller.addField("cpf", professor.cpf);
	controller.addField("matricula", professor.registry);
	controller.addField("regimeContrato", professor.contract);
	controller.addField("status", professor.status);
	controller.addField("codigo", professor.code);
	controller.addField("titulacao", professor.title);
	return controller;
}

export default function SaveProfessorForm({
	professor,
}: {
	professor?: Professor;
}) {
	const [initialController] = useState(() =>
		createInitialController(professor),
	);
	const { FormContainer } = useForm({
		initialController,
		actions: saveAction,
		actionsExtras: { id: professor?.id },
	});
	const edit = professor !== undefined;

	return (
		<FormContainer className="flex flex-col gap-8 m-5">
			<FormSection
				section={"Informações Básicas"}
				description={"Informações basicas sobre o Professor à ser adicionado"}
			>
				<FormInput
					required={!edit}
					name={"nome"}
					type="text"
					label="Nome Completo"
					ValueFormatter={NameFormatter}
					submitFormattedData
					lettersOnly
				/>
				<FormInput
					required={!edit}
					name={"cpf"}
					type="text"
					label="CPF"
					ValueFormatter={CPFFormatter}
				/>
			</FormSection>

			<FormSection
				section={"Dados de Docente"}
				description={
					"Dados relacionados a vida acadêmica deste Professor dentro da institução"
				}
			>
				<FormInput
					required={!edit}
					maxLength={10}
					name={"matricula"}
					type="text"
					label="Matrícula"
				/>

				<FormInput
					name={"regimeContrato"}
					type="select"
					label="Contrato"
					options={{
						Determinado: "DETERMINADO",
						Indeterminado: "INDETERMINADO",
						Temporário: "TEMPORARIO",
					}}
					required={!edit}
				/>
				<FormInput
					name={"status"}
					type="select"
					label="Status"
					options={{
						Ativo: "ATIVO",
						Inativo: "INATIVO",
						Temporário: "AFASTADO",
					}}
					required={!edit}
				/>

				<FormInput
					name={"titulacao"}
					type="select"
					label="Titulação"
					options={{
						Graduado: "GRADUADO",
						Especialista: "ESPECIALISTA",
						Mestre: "MESTRE",
						Doutor: "DOUTOR",
						"Pós Doutorado": "POS_DOUTOR",
					}}
					required={!edit}
				/>

				<FormInput name="codigo" type="text" label="Código" />
			</FormSection>

			<button type="submit" className="flex btn btn-success">
				{edit ? "Salvar Alterações" : "Adicionar"}
			</button>
		</FormContainer>
	);
}
