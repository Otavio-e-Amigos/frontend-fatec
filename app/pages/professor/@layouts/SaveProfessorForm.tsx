// import { useEffect } from "react";
import CPFFormatter from "~/classes/ValueFormatters/CPFFormatter";
import NameFormatter from "~/classes/ValueFormatters/NameFormatter";
// import FormContainer from "~/components/forms/FormContainer";
// import type FormController from "~/components/forms/FormController";
import FormInput from "~/components/forms/FormInput";
import useForm from "~/hooks/useForm";
import FormSection from "~/layouts/forms/FormSection";
import saveAction from "~/modules/professor/@actions/save.action";
import type Professor from "~/modules/professor/professor.class";

let added = false;

export default function SaveProfessorForm({
	professor,
}: {
	professor?: Professor;
}) {
	const { controller, FormContainer } = useForm({
		actions: saveAction,
		actionsExtras: { id: professor ?.id }
	});
	const edit = professor !== undefined;

	if (professor && !added) {
		// REFLECT i think i could transform those lines workflow into a single mapper function
		controller.addField("nome", professor.name);
		controller.addField("cpf", professor.cpf);

		controller.addField("matricula", professor.registry);
		controller.addField("regimeContrato", professor.contract);
		controller.addField("status", professor.status);
		controller.addField("codigo", professor.code);
		controller.addField("titulacao", professor.title);
		added = true;
	}

	console.log(professor);

	return (
		<FormContainer
			// initialController={controller}
			// onSubmit={submit}
			className="flex flex-col gap-8 m-5"
		>
			{/*
				REFLECT i think i can use hidden value inputs for managing states between formatted value objects,
				or i could just go object-based on FormController
				*/}
			{/*<input type="hidden" disabled name="disabled_value_shouldnt_be_here" value={"i believe this value shouldn't appear on console log since it's disabled?"}/>*/}
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
				/>
				<FormInput
					required={!edit}
					name={"cpf"}
					type="text"
					label="CPF"
					ValueFormatter={CPFFormatter}
				/>
				{/*<FormInput required name={"professor"} type="text" label="Cursos" />*/
				/* TO BE ADDED LATER */}
			</FormSection>

			<FormSection
				section={"Dados de Docente"}
				description={
					"Dados relacionados a vida acadêmica deste Professor dentro da institução"
				}
			>
				<FormInput
					required={!edit}
					name={"matricula"}
					type="text"
					label="Matrícula"
				/>

				{/* TODO change to select with restricted options (DETERMIADO, INDETERMINADO, TEMPORARIO) */}
				{/*<FormInput
					required={!editMode}
					name={"contrato"}
					type="text"
					label="Contrato"
				/>*/}
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
				{/*<div className="flex flex-col">
					<label>
						Contrato {!edit && <span className="text-rose-500">*</span>}
					</label>
					<select
						name="regimeContrato"
						defaultValue={"DETERMINADO"}
						className="form-input"
					>
						<option value={"DETERMINADO"} selected>
							Determinado
						</option>
						<option value={"INDETERMINADO"}>Indeterminado</option>
						<option value={"TEMPORARIO"}>Temporário</option>
					</select>
				</div>*/}

				{/* TODO change to according value */}
				{/*<FormInput
					required={!editMode}
					name={"status"}
					type="text"
					label="Status"
				/>*/}
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

				{/*<div className="flex flex-col">
					<label>
						Status {!edit && <span className="text-rose-500">*</span>}
					</label>
					<select name="status" className="form-input">
						<option value={"ATIVO"} selected>
							Ativo
						</option>
						<option value={"INATIVO"}>Inativo</option>
						<option value={"AFASTADO"}>Afastado</option>
					</select>
				</div>*/}

				{/* TODO change to according value */}
				{/*<FormInput name={"titulacao"} type="text" label="Titulação" />*/}
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

				{/*<div className="flex flex-col">
					<label>
						Titulação {!edit && <span className="text-rose-500">*</span>}
					</label>
					<select name="titulacao" className="form-input">
						<option value={"GRADUADO"} selected>
							Graduado
						</option>
						<option value={"ESPECIALISTA"}>Especialista</option>
						<option value={"MESTRE"}>Mestre</option>
						<option value={"DOUTOR"}>Doutor</option>
						<option value={"POS_DOUTOR"}>Pós Doutorado</option>
					</select>
				</div>*/}

				{/* TODO change to according value */}
				<FormInput name={"codigo"} type="text" label="Código" />
			</FormSection>

			<p className="text-hint-warning w-full text-right">
				{controller.error?.message}
			</p>
			<button type="submit" className="flex btn btn-success">
				{edit ? "Salvar Alterações" : "Adicionar"}
			</button>
		</FormContainer>
	);
}
