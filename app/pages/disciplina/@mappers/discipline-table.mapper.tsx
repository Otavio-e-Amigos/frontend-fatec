import { useRevalidator } from "react-router";
import useDialogs from "~/hooks/useDialogs";
import useWindow from "~/components/windows/useWindow";
import ConfirmationWindowAction from "~/layouts/windows/actions/Confirmation.window-action";
import BasicWindow from "~/layouts/windows/BasicWindow";
import type Disciplina from "~/modules/disciplina/disciplina.class";
import DisciplinaService from "~/modules/disciplina/disciplina.service";
import AuthService from "~/modules/user/auth.service";
import SaveDisciplinaForm from "../@layouts/SaveDisciplinaForm";
import type { WindowAPIConstructor } from "~/components/windows/window.types";

function RowActions({ item }: { item: Disciplina }) {
	const windowData: WindowAPIConstructor = {
		title: "Excluir disciplina?",
		dismissible: true,
		description: `A disciplina selecionada será excluída. Esta ação não pode ser desfeita.`,
		tone: "danger",
		actions: <ConfirmationWindowAction idleState={"Excluir"} />,
	};
	const { revalidate } = useRevalidator();
	const dialogs = useDialogs();
	const window = useWindow({
		wrapper: BasicWindow,
		initialData: windowData,
	});

	async function removeDiscipline() {
		window.show({
			...windowData,
			description: `A disciplina ${item.nome ?? ""} será excluída. Esta ação não pode ser desfeita.`,
			extras: {
				onConfirm: async () => {
					const deleted = await DisciplinaService.delete(
						item.id!,
						AuthService.getUserToken(),
					);
					if (!deleted) {
						throw new Error(
							"Não foi possível excluir a disciplina. Tente novamente.",
						);
					} else {
						dialogs.toast.success("Disciplina excluída com sucesso.");
						revalidate();
						window.hide();
					}
				},
			},
		});
	}

	async function edit() {
		// window.setWrapper(() => (
		// 	<SaveDisciplinaForm
		// 		disciplina={item}
		// 		onSaved={() => {
		// 			// setEditing(undefined);
		// 			window.hide();
		// 			revalidate();
		// 		}}
		// 	/>
		// ));
		window.show(
			{ dismissible: true },
			<SaveDisciplinaForm
				disciplina={item}
				onSaved={() => {
					// setEditing(undefined);
					window.hide();
					revalidate();
				}}
			/>,
		);
		// window.show({
		// wrapper: BasicWindow,
		// dismissible: true,
		// body: (
		// 	<SaveDisciplinaForm
		// 		disciplina={item}
		// 		onSaved={() => {
		// 			// setEditing(undefined);
		// 			window.hide();
		// 			revalidate();
		// 		}}
		// 	/>
		// ),
		// });
	}

	return (
		<div className="row-actions">
			<button
				type="button"
				className="btn"
				data-variant="icon"
				data-icon="edit"
				title="Editar"
				// onClick={() => setEditing(item)}
				onClick={edit}
			>
				Editar
			</button>
			<button
				type="button"
				className="btn"
				data-variant="icon"
				data-icon="delete"
				title="Excluir"
				onClick={removeDiscipline}
			>
				Excluir
			</button>
		</div>
	);
}

export default function mapper(item: Disciplina) {
	return [
		item.nome ?? "",
		item.codigo ?? "",
		item.sigla ?? "",
		{
			value: "",
			display: <RowActions item={item} />,
		},
	];
}
