import FormInput from "~/components/forms/FormInput";
import useForm from "~/hooks/useForm";
import BasicFormLayout from "~/layouts/forms/BasicFormLayout";
import FormSection from "~/layouts/forms/FormSection";
import save from "~/modules/periodo-letivo/@actions/save.action";
import type PeriodoLetivo from "~/modules/periodo-letivo/periodo-letivo.class";
import type { PeriodoLetivoInterface } from "~/modules/periodo-letivo/periodo-letivo.class";

export default function SavePeriodoForm({
	periodo,
	initialValues,
	onSaved,
}: {
	periodo?: PeriodoLetivo;
	/** Preenche o formulário sem entrar em modo edição. */
	initialValues?: PeriodoLetivoInterface;
	onSaved?: () => void;
}) {
	const { controller, FormContainer } = useForm({
		actions: save,
		actionsExtras: { id: periodo?.id, onSaved },
	});

	const seed = periodo ?? initialValues;
	if (seed) {
		controller.addField("ano", String(seed.ano ?? ""));
		controller.addField("semestre", String(seed.semestre ?? ""));
		controller.addField("dataInicio", seed.dataInicio?.slice(0, 10) ?? "");
		controller.addField("dataFim", seed.dataFim?.slice(0, 10) ?? "");
	}

	return (
		<BasicFormLayout
			title={
				periodo
					? `Editar Período Letivo ${periodo.ano}/${periodo.semestre}`
					: "Cadastrar Período Letivo"
			}
			description={
				periodo
					? "Altere os dados do período letivo e salve."
					: "Use este formulário para realizar o cadastro de um novo período letivo"
			}
			Form={FormContainer}
		>
			<FormSection
				section="Informações Básicas"
				description="Dados para o cadastro de períodos letivos da instituição, importantes para a geração dos documentos."
			>
				<FormInput required name="ano" type="number" label="Ano" />

				<FormInput
					required
					name="semestre"
					type="select"
					label="Semestre"
					options={{
						"1º Semestre": "1",
						"2º Semestre": "2",
					}}
				/>

				<FormInput
					required
					name="dataInicio"
					type="date"
					label="Data inicial"
				/>

				<FormInput required name="dataFim" type="date" label="Data final" />
			</FormSection>

			<p className="text-hint-alert-dot w-full text-right">
				{controller.error?.message}
			</p>
			<button type="submit" className="btn btn-success">
				{periodo ? "Salvar alterações" : "Adicionar"}
			</button>
		</BasicFormLayout>
	);
}