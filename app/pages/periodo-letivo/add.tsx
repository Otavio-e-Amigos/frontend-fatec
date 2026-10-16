import { Link } from "react-router";
// import FormContainer from "~/components/forms/FormContainer";
import FormInput from "~/components/forms/FormInput";
import useForm from "~/hooks/useForm";
import Header from "~/layouts/Header";
import type PeriodoLetivo from "~/modules/periodo-letivo/periodo-letivo.class";
import actions from "~/modules/periodo-letivo/@actions/save.action";

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
			<div className="mx-5 mt-5 flex flex-wrap items-center justify-between gap-3">
				<h1 className="text-4xl">
					{periodo ? "Editar período letivo" : "Adicionar período letivo"}
				</h1>
				<Link className="btn" data-variant="outline" to="/periodo-letivo">
					Voltar para períodos
				</Link>
			</div>
			<FormContainer className="surface m-5 flex max-w-2xl flex-col gap-4 rounded-card border border-line p-5">
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
			</FormContainer>
		</main>
	);
}
