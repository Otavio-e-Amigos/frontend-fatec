import FormContainer from "~/components/forms/FormContainer";
import FormInput from "~/components/forms/FormInput";
import FormSection from "~/layouts/forms/FormSection";
import type Disciplina from "~/modules/disciplina/disciplina.class";

export default function SaveDisciplinaForm({ disciplina, onSubmit }: { disciplina?: Disciplina; onSubmit: any }) {
	return <FormContainer onSubmit={onSubmit} className="flex flex-col gap-8 m-5">
		<FormSection section="Informações da disciplina" description="Dados acadêmicos usados nas grades e folhas de frequência.">
			<FormInput required name="nome" type="text" label="Nome" value={disciplina?.nome} />
			<FormInput required name="codigo" type="text" label="Código" value={disciplina?.codigo} />
			<FormInput required name="sigla" type="text" label="Sigla" value={disciplina?.sigla} />
		</FormSection>
		<button type="submit" className="btn btn-success">{disciplina ? "Salvar alterações" : "Adicionar"}</button>
	</FormContainer>;
}
