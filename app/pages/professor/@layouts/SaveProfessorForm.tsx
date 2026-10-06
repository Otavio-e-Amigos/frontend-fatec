import NameFormatter from "~/classes/ValueFormatters/NameFormatter";
import FormContainer from "~/components/forms/FormContainer";
import type FormController from "~/components/forms/FormController";
import FormInput from "~/components/forms/FormInput";
import FormSection from "~/layouts/forms/FormSection";

export default function SaveProfessorForm({controller, submit, edit}: {controller:FormController, submit:any, edit?:boolean}) {
	return (
		<FormContainer
			initialController={controller}
			onSubmit={submit}
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
				/>
				<FormInput
					required={!edit}
					name={"cpf"}
					type="text"
					label="CPF"
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
				<div className="flex flex-col">
					<label>
						Contrato {!edit && <span className="text-rose-500">*</span>}
					</label>
					<select name="regimeContrato" defaultValue={"DETERMINADO"} className="form-input">
						<option value={"DETERMINADO"} selected>
							Determinado
						</option>
						<option value={"INDETERMINADO"}>Indeterminado</option>
						<option value={"TEMPORARIO"}>Temporário</option>
					</select>
				</div>

				{/* TODO change to according value */}
				{/*<FormInput
					required={!editMode}
					name={"status"}
					type="text"
					label="Status"
				/>*/}
				<div className="flex flex-col">
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
				</div>

				{/* TODO change to according value */}
				{/*<FormInput name={"titulacao"} type="text" label="Titulação" />*/}
				<div className="flex flex-col">
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
				</div>

				{/* TODO change to according value */}
				<FormInput name={"codigo"} type="text" label="Código" />
			</FormSection>

			{/*<FormSection
				section={"Extras"}
				description={
					"Informações extras que podem facilitar o contato do Docente ou para outros aspectos que possam te ajudar."
				}
			>
				<FormInput name={"email"} type="text" label="E-Mail" />
				<FormInput name={"teams"} type="text" label="Usuário Teams" />
				<FormInput name={"telefone"} type="text" label="Telefone" />
			</FormSection>*/}

			{/* DELETE THIS ASAP */}
			{/*
				<FormContainer
				controller={decoy}
				className="flex flex-1 flex-col gap-10 my-5 mx-20"
				>
				<FormInput
					type="text"
					name={"formControllerField01"}
					label="FormController Field #01"
				/>
				<FormInput
					type="text"
					InputFormatter={PhoneFormatter}
					validator={new PhoneNumberValidator()}
					name={"formControllerField02"}
					label="FormController Field #02"
				/>
				<FormInput
					type="text"
					name={"formControllerField03"}
					label="FormController Field #03"
				/>

				<FormInput
					type="text"
					name={"formControllerField04"}
					InputFormatter={CPFFormatter}
					label="FormController Field #03"
				/>

				<FormInput
					type="text"
					name={"formControllerField05"}
					InputFormatter={LegalNameFormatter}
					label="FormController Field #04"
				/>
				<button type="submit">Submit</button>
			</FormContainer>*/}
			<button type="submit" className="flex btn btn-success">
				{edit ? "Salvar Alterações" : "Adicionar"}
			</button>
		</FormContainer>
	)
}
