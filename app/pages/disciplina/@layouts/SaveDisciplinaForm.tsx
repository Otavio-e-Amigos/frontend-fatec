// import FormContainer from "~/components/forms/FormContainer";
import FormInput from "~/components/forms/FormInput";
import useForm from "~/hooks/useForm";
import BasicFormLayout from "~/layouts/forms/BasicFormLayout";
import FormSection from "~/layouts/forms/FormSection";
import type Disciplina from "~/modules/disciplina/disciplina.class";
import actions from "~/modules/disciplina/@actions/save.action";

export default function SaveDisciplinaForm({
	disciplina,
}: {
	disciplina?: Disciplina;
}) {
	const { controller, FormContainer } = useForm({
		actions,
		actionsExtras: { id: disciplina?.id },
	});
	// console.log(disciplina)

	if (disciplina) {
		controller.addField("nome", disciplina?.nome);
		controller.addField("codigo", disciplina?.codigo);
		controller.addField("sigla", disciplina?.sigla);
	}

	return (
		<BasicFormLayout
			title={
				disciplina
					? `Editar Disciplina "${disciplina?.nome}"`
					: `Cadastrar Disciplina`
			}
			description={
				"Use este formulário para realizar o cadastro de uma nova disciplina"
			}
			Form={FormContainer}
		>
			<FormSection
				section="Informações da disciplina"
				description="Dados acadêmicos usados nas grades e folhas de frequência."
			>
				<FormInput required lettersOnly name="nome" type="text" label="Nome" />
				<FormInput
					required
					maxLength={10}
					name="codigo"
					type="text"
					label="Código"
				/>
				<FormInput
					required
					maxLength={8}
					lettersOnly
					name="sigla"
					type="text"
					label="Sigla"
				/>
			</FormSection>
			<button type="submit" className="btn btn-success">
				{disciplina ? "Salvar alterações" : "Adicionar"}
			</button>
		</BasicFormLayout>
	);
}
