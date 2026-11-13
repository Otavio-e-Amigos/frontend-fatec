import { useRevalidator } from "react-router";
import useToast from "~/components/toasts/useToast";
import useWindow from "~/components/windows/useWindow";
import type { WindowAPIConstructor } from "~/components/windows/window.types";
import ConfirmationWindowAction from "~/layouts/windows/actions/Confirmation.window-action";
import BasicWindow from "~/layouts/windows/BasicWindow";
import type EventoCalendario from "~/modules/calendario/calendario.class";
import { formatTipoEvento } from "~/modules/calendario/calendario.class";
import CalendarioService from "~/modules/calendario/calendario.service";
import { EventoCalendarioDeletedToast } from "~/modules/calendario/calendario.toasts";
import formatDate from "~/modules/periodo-letivo/format-date";
import AuthService from "~/modules/user/auth.service";
import SaveEventoForm from "../@layouts/SaveEventoForm";

const WEEKDAYS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

function weekday(date?: string) {
	if (!date) return "";
	const [y, m, d] = date.split("-").map(Number);
	return WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()] ?? "";
}

function RowActions({ item }: { item: EventoCalendario }) {
	const windowData: WindowAPIConstructor = {
		title: "Remover evento?",
		dismissible: true,
		tone: "danger",
		actions: <ConfirmationWindowAction idleState={"Remover"} />,
	};
	const { revalidate } = useRevalidator();
	const toast = useToast();
	const window = useWindow({ initialData: windowData });

	function edit() {
		window.show(
			{ dismissible: true },
			<SaveEventoForm
				evento={item}
				onSaved={() => {
					window.hide();
					revalidate();
				}}
			/>,
		);
	}

	function remove() {
		window.show(
			{
				...windowData,
				description: `O evento "${item.descricao}" (${formatDate(item.data)}) será removido. Se a data for um feriado fixo, ela voltará ao comportamento padrão do sistema.`,
				extras: {
					onConfirm: async () => {
						const deleted = await CalendarioService.delete(
							item.data!,
							AuthService.getUserToken(),
						);
						if (!deleted) {
							throw new Error("Não foi possível remover o evento. Tente novamente.");
						}
						toast.push(EventoCalendarioDeletedToast);
						revalidate();
						window.hide();
					},
				},
			},
			<BasicWindow />,
		);
	}

	return (
		<div className="row-actions">
			<button
				type="button"
				className="btn"
				data-variant="icon"
				data-icon="edit"
				title="Editar"
				onClick={edit}
			>
				Editar
			</button>
			<button
				type="button"
				className="btn"
				data-variant="icon"
				data-icon="delete"
				title="Remover"
				onClick={remove}
			>
				Remover
			</button>
		</div>
	);
}

export default function mapper(item: EventoCalendario) {
	return [
		{ value: item.data ?? "", display: formatDate(item.data) },
		weekday(item.data),
		item.descricao ?? "",
		formatTipoEvento(item.tipo),
		item.semAula ? "Sim" : "Não",
		{ value: "", display: <RowActions item={item} /> },
	];
}
