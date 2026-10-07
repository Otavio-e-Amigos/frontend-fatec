import FormContainer from "~/components/forms/FormContainer";
import FormInput from "~/components/forms/FormInput";
import FormSection from "~/layouts/forms/FormSection";
import type Curso from "~/modules/curso/curso.class";

export default function SaveCursoFrom({
  curso,
  onSubmit,
}: {
  curso?: Curso;
  onSubmit: any;
}) {
  return (
    <FormContainer onSubmit={onSubmit} className="flex flex-col gap-8 m-5">
      <FormSection
        section="Informações da curso"
        description="Dados acadêmicos usados nas grades e folhas de frequência."
      >
        <FormInput
          required
          name="nome"
          type="text"
          label="Nome"
          value={curso?.nome}
        />
        <FormInput
          required
          name="turno"
          type="select"
          label="Turno"
          value={curso?.turno ?? "MANHA"}
          options={[
            { value: "MANHA", label: "MANHÃ" },
            { value: "TARDE", label: "TARDE" },
            { value: "NOITE", label: "NOITE" },
          ]}
        />
        <FormInput
          required
          name="sigla"
          type="text"
          label="Sigla"
          value={curso?.sigla}
        />
      </FormSection>
      <button type="submit" className="btn btn-success">
        {curso ? "Salvar alterações" : "Adicionar"}
      </button>
    </FormContainer>
  );
}
