// import FormContainer from "~/components/forms/FormContainer";
import FormInput from "~/components/forms/FormInput";
import useForm from "~/hooks/useForm";
import FormSection from "~/layouts/forms/FormSection";
import type Curso from "~/modules/curso/curso.class";
import save from "~/modules/curso/@actions/save.action";

export default function SaveCursoFrom({
  curso,
}: {
  curso?: Curso;
}) {
  const { controller, FormContainer } = useForm({
		actions: save,
		actionsExtras: {
			id: curso?.id
    }
  });

  // if (curso && !controller.fieldExists("nome")) {
  if (curso) {
    controller.addField("nome", curso.nome);
    controller.addField("turno", curso.turno ?? "MANHA");
    controller.addField("sigla", curso.sigla);
  }

  return (
    <FormContainer className="flex flex-col gap-8 m-5">
      <FormSection
        section="Informações da curso"
        description="Dados acadêmicos usados nas grades e folhas de frequência."
      >
        <FormInput
          required
					lettersOnly
          name="nome"
          type="text"
          label="Nome"
          // value={curso?.nome}
        />
        <FormInput
          required
          name="turno"
          type="select"
          label="Turno"
					options={{
						"Manhã": "MANHA",
						"Tarde": "TARDE",
						"Noite": "NOITE",
					}}
        />
        <FormInput
          required
					maxLength={10}
					lettersOnly
          name="sigla"
          type="text"
          label="Sigla"
        />
			</FormSection>
      <button type="submit" className="btn btn-success">
        {curso ? "Salvar alterações" : "Adicionar"}
      </button>
    </FormContainer>
  );
}
