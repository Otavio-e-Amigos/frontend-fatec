// import { useNavigate } from "react-router";
import BasicFormLayout from "~/layouts/forms/BasicFormLayout";
// import FormContainer from "~/components/forms/FormContainer";
import FormInput from "~/components/forms/FormInput";

import useForm from "~/hooks/useForm";
import Header from "~/layouts/Header";
import PeriodoLetivo from "~/modules/periodo-letivo/periodo-letivo.class";
import actions from "~/modules/periodo-letivo/@actions/save.action";
import FormSection from "~/layouts/forms/FormSection";

export default function AddPeriodo({
	periodo,
}: {
	periodo?: PeriodoLetivo;
}) {
	const { FormContainer, isSubmitting } = useForm({
		actions,
		actionsExtras: { id: periodo?.id },
	});
	return (
		<main className="flex flex-1 flex-col">
			<Header activeItem="Períodos" />

			{/*<h1 className="text-4xl my-5 mx-2">Adicionar período letivo</h1>*/}

			<BasicFormLayout
				title={"Cadastrar Período Letivo"}
				description={
					"Use este formulário para realizar o cadastro de um novo período letivo"
				}
				Form={FormContainer}
			>
				<FormSection
					section={"Informações Básicas"}
					description={"Dados para o cadastro de períodos letivos da instituição, importantes para a geração dos documentos."}
				>
					<FormInput
					required
					name="ano"
					type="number"
					label="Ano"
					value={periodo?.ano ?? ""}
				/>
				<FormInput
					required
					name="semestre"
					type="select"
					label="Semestre"
					options={{
						"1º Semestre": "1",
						"2º Semestre": "2",
					}}
					value={periodo?.semestre ?? ""}
				/>
				<FormInput
					required
					name="dataInicio"
					type="date"
					label="Data inicial"
					value={periodo?.dataInicio?.slice(0, 10) ?? ""}
				/>
				<FormInput
					required
					name="dataFim"
					type="date"
					label="Data final"
					value={periodo?.dataFim?.slice(0, 10) ?? ""}
				/>
				<button type="submit" className="btn self-start" disabled={isSubmitting}>
					{periodo ? "Salvar alterações" : "Adicionar período"}
				</button>
			</BasicFormLayout>
		</main>
	);
}
