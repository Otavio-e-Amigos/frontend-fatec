import FormInput from "~/components/forms/FormInput";
import useForm from "~/hooks/useForm";
import BasicFormLayout from "~/layouts/forms/BasicFormLayout";
import FormSection from "~/layouts/forms/FormSection";
import type Curso from "~/modules/curso/curso.class";
import type { CursoInterface } from "~/modules/curso/curso.class";
import save from "~/modules/curso/@actions/save.action";

export default function SaveCursoFrom({
	curso,
	initialValues,
	onSaved,
}: {
	curso?: Curso;
	/** Preenche o formulário sem entrar em modo edição (ex.: dados vindos da grade). */
	initialValues?: CursoInterface;
	onSaved?: () => void;
}) {
	const { controller, FormContainer } = useForm({
		actions: save,
		actionsExtras: { id: curso?.id, onSaved },
	});

	const seed = curso ?? initialValues;
	if (seed) {
		controller.addField("nome", seed.nome);
		controller.addField("turno", seed.turno ?? "MANHA");
		controller.addField("sigla", seed.sigla);
	}

	return (
		<BasicFormLayout
			title={curso ? `Editar Curso "${curso.nome}"` : `Cadastrar Curso`}
			description={
				curso
					? "Altere os dados do curso e salve."
					: "Use este formulário para realizar o cadastro de um novo curso"
			}
			Form={FormContainer}
		>
			<FormSection
				section="Informações do curso"
				description="Dados acadêmicos usados nas grades e folhas de frequência."
			>
				<FormInput required lettersOnly name="nome" type="text" label="Nome" />

				<FormInput
					required
					name="turno"
					type="select"
					label="Turno"
					options={{
						Manhã: "MANHA",
						Tarde: "TARDE",
						Noite: "NOITE",
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
			<p className="text-hint-alert-dot w-full text-right">
				{controller.error?.message}
			</p>
			<button type="submit" className="btn btn-success">
				{curso ? "Salvar alterações" : "Adicionar"}
			</button>
		</BasicFormLayout>
	);
}