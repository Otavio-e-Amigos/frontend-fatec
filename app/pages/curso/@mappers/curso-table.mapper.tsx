import type PeriodoLetivo from "~/modules/periodo-letivo/periodo-letivo.class";
import formatPeriodoDate from "~/modules/periodo-letivo/format-date";
import { useRevalidator } from "react-router";
import useWindow from "~/components/windows/useWindow";
import type { WindowAPIConstructor } from "~/components/windows/window.types";
import useDialogs from "~/hooks/useDialogs";
import ConfirmationWindowAction from "~/layouts/windows/actions/Confirmation.window-action";
import BasicWindow from "~/layouts/windows/BasicWindow";
import type Disciplina from "~/modules/disciplina/disciplina.class";
// import SavePeriodoForm from "../@layouts/SavePeriodoForm";
import formatTurno from "~/modules/curso/format-turno";
import SaveCursoFrom from "../@layouts/SaveCursoForm";
import type Curso from "~/modules/curso/curso.class";

function RowActions({ item }: { item: Disciplina }) {
	const windowData: WindowAPIConstructor = {
		// title: "Excluir disciplina?",
		dismissible: true,
		// description: `A disciplina selecionada será excluída. Esta ação não pode ser desfeita.`,
		// tone: "danger",
		// actions: <ConfirmationWindowAction idleState={"Excluir"} />,
	};
	const { revalidate } = useRevalidator();
	// const dialogs = useDialogs();
	const window = useWindow({
		wrapper: (
			<SaveCursoFrom
				curso={item}
				onSaved={() => {
					// setEditing(undefined);
					window.hide();
					revalidate();
				}}
			/>
		),
		initialData: windowData,
	});

	function edit() {
		// window.setWrapper(() => (
		// 	<SavePeriodoForm
		// 		periodo={item}
		// 		onSaved={() => {
		// 			// setEditing(undefined);
		// 			window.hide();
		// 			revalidate();
		// 		}}
		// 	/>
		// ));
		window.show();
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
		</div>
	);
}

export default function mapper(curso: Curso) {
	return [
		curso.nome ?? "",
		curso.sigla ?? "",
		formatTurno(curso.turno),
		{
			value: "",
			display: (<RowActions item={curso}/>
				// <div className="row-actions">
				// 	<button
				// 		type="button"
				// 		className="btn"
				// 		data-variant="icon"
				// 		data-icon="edit"
				// 		title="Editar"
				// 		onClick={() => setEditing(curso)}
				// 	>
				// 		Editar
				// 	</button>
				// </div>
			),
		},
	];
}
