// import FormContainer from "~/components/forms/FormContainer";
import FormInput from "~/components/forms/FormInput";
import useForm from "~/hooks/useForm";
import BasicFormLayout from "~/layouts/forms/BasicFormLayout";
import FormSection from "~/layouts/forms/FormSection";
import type Disciplina from "~/modules/disciplina/disciplina.class";
import actions from "~/modules/disciplina/@actions/save.action";

let added = false;

export default function SaveDisciplinaForm({
	disciplina,
}: {
	disciplina?: Disciplina;
}) {
	const { controller, FormContainer } = useForm({
		actions,
		actionsExtras: {id: disciplina?.id}
	});
	// console.log(disciplina)

	if (disciplina) {
		controller.addField("nome", disciplina?.nome);
		controller.addField("codigo", disciplina?.codigo);
		controller.addField("sigla", disciplina?.sigla);
	}

	return (
		<BasicFormLayout
			title={"Cadastrar Disciplina"}
			description={"Use este formulário para realizar o cadastro de uma nova disciplina"}
			Form={FormContainer}
		>
			<FormSection
				section="Informações da disciplina"
				description="Dados acadêmicos usados nas grades e folhas de frequência."
			>
				<FormInput required name="nome" type="text" label="Nome" />
				<FormInput required name="codigo" type="text" label="Código" />
				<FormInput required name="sigla" type="text" label="Sigla" />
			</FormSection>
			<p className="text-hint-warning">{ controller?.error?.message }</p>
			<button type="submit" className="btn btn-success">
				{disciplina ? "Salvar alterações" : "Adicionar"}
			</button>
		</BasicFormLayout>
	);
}
