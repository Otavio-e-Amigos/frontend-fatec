import NameFormatter from "~/classes/ValueFormatters/NameFormatter";
import FormContainer from "~/components/forms/FormContainer";
import type FormController from "~/components/forms/FormController";
import FormInput from "~/components/forms/FormInput";
import FormSection from "~/layouts/forms/FormSection";

export default function SaveCourseForm({controller, submit, edit}: {controller:FormController, submit:any, edit?:boolean}) {
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
				section={"Dados do Curso"}
				description={
					"Dados relacionados ao curso  à ser adicionado"
				}
			>
				<FormInput
					required={!edit}
					name={"nome"}
					type="text"
					label="Nome do Curso"
					ValueFormatter={NameFormatter}
				/>

				<div className="flex flex-col">
					<label>
						Turno {!edit && <span className="text-rose-500">*</span>}
					</label>
					<select name="turno" defaultValue={"MANHA"} className="form-input">
						<option value={"MANHA"} selected>
							MANHA
						</option>
						<option value={"TARDE"}>TARDE</option>
						<option value={"NOITE"}>NOITE</option>
					</select>
				</div>

				<FormInput
					required={!edit}
					name={"unidade"}
					type="text"
					label="Unidade"
				/>
				<FormInput
					required={!edit}
					name={"sigla"}
					type="text"
					label="Sigla"
				/>

			</FormSection>

					<button type="submit" className="flex btn btn-success">
				{edit ? "Salvar Alterações" : "Adicionar"}
			</button>
		</FormContainer>
	)
}
