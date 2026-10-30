import FormInput from "~/components/forms/FormInput";
import useForm from "~/hooks/useForm";
import BasicFormLayout from "~/layouts/forms/BasicFormLayout";
import FormSection from "~/layouts/forms/FormSection";
import type Curso from "~/modules/curso/curso.class";
import save from "~/modules/curso/@actions/save.action";
import ShadowCenter from "~/layouts/containers/ShadowCenter";
import { useContext } from "react";
import { WindowContext } from "~/components/windows/window.contexts";

export default function SaveCursoFrom({
	curso,
	onSaved,
}: {
	curso?: Curso;
	onSaved?: () => void;
}) {
	const { controller, FormContainer } = useForm({
		actions: save,
		actionsExtras: { id: curso?.id, onSaved },
	});
	const window = useContext(WindowContext);

	if (curso) {
		controller.addField("nome", curso.nome);
		controller.addField("turno", curso.turno ?? "MANHA");
		controller.addField("sigla", curso.sigla);
	}

	return (
		<ShadowCenter
			onClick={() => {
				window.dismissible && window.hide();
			}}
		>
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
					<FormInput
						required
						lettersOnly
						name="nome"
						type="text"
						label="Nome"
					/>

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
		</ShadowCenter>
	);
}
