// import FormContainer from "~/components/forms/FormContainer";
import FormInput from "~/components/forms/FormInput";
import useForm from "~/hooks/useForm";
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
		<FormContainer className="flex flex-col gap-8 m-5">
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
		</FormContainer>
	);
}
