import { useContext } from "react";
import FormInput from "~/components/forms/FormInput";
import { WindowContext } from "~/components/windows/window.contexts";
import useForm from "~/hooks/useForm";
import ShadowCenter from "~/layouts/containers/ShadowCenter";
import BasicFormLayout from "~/layouts/forms/BasicFormLayout";
import FormSection from "~/layouts/forms/FormSection";
import actions from "~/modules/calendario/@actions/save.action";
import { TIPOS_EVENTO } from "~/modules/calendario/calendario.class";
import type EventoCalendario from "~/modules/calendario/calendario.class";

export default function SaveEventoForm({
	evento,
	onSaved,
}: {
	evento?: EventoCalendario;
	onSaved?: () => void;
}) {
	const { FormContainer, isSubmitting } = useForm({
		actions,
		actionsExtras: { data: evento?.data, onSaved },
	});
	const window = useContext(WindowContext);

	return (
		<ShadowCenter onClick={() => { window.dismissible && window.hide(); }}>
			<BasicFormLayout
				title={evento ? "Editar evento" : "Adicionar evento"}
				description={
					evento
						? "Altere os dados do evento e salve."
						: "Cadastre um feriado ou dia sem aula no calendário."
				}
				Form={FormContainer}
			>
				<FormSection
					section={"Informações do evento"}
					description={
						"Dias marcados como \"sem aula\" são descontados na geração da folha de ponto."
					}
				>
					<FormInput
						required
						name="data"
						type="date"
						label="Data"
						value={evento?.data ?? ""}
						disabled={Boolean(evento)}
					/>

					<FormInput
						required
						name="descricao"
						label="Descrição"
						value={evento?.descricao ?? ""}
					/>

					<FormInput
						required
						name="tipo"
						type="select"
						label="Tipo"
						options={TIPOS_EVENTO}
						value={evento?.tipo ?? "FERIADO"}
					/>

					<FormInput
						required
						name="semAula"
						type="select"
						label="Suspende as aulas?"
						options={{ Sim: "true", Não: "false" }}
						value={evento ? String(evento.semAula) : "true"}
					/>

					<button type="submit" className="btn self-start" disabled={isSubmitting}>
						{evento ? "Salvar alterações" : "Adicionar evento"}
					</button>
				</FormSection>
			</BasicFormLayout>
		</ShadowCenter>
	);
}
