import type PeriodoLetivo from "~/modules/periodo-letivo/periodo-letivo.class";
import formatPeriodoDate from "~/modules/periodo-letivo/format-date";
import { useRevalidator } from "react-router";
import useWindow from "~/components/windows/useWindow";
import type { WindowAPIConstructor } from "~/components/windows/window.types";
import type Disciplina from "~/modules/disciplina/disciplina.class";
import SavePeriodoForm from "../@layouts/SavePeriodoForm";

function RowActions({ item }: { item: Disciplina }) {
	const windowData: WindowAPIConstructor = {
		dismissible: true,
	};
	const { revalidate } = useRevalidator();
	const window = useWindow({
		initialData: windowData,
	});

	function edit() {
		window.show(
			{ ...windowData },
			<SavePeriodoForm
				periodo={item}
				onSaved={() => {
					window.hide();
					revalidate();
				}}
			/>,
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
		</div>
	);
}

export default function mapper(item: PeriodoLetivo) {
	return [
		`${item.ano}/${item.semestre}`,
		item.ano ?? "",
		`${item.semestre}º`,
		formatPeriodoDate(item.dataInicio),
		formatPeriodoDate(item.dataFim),
		{
			value: "",
			display: <RowActions item={item} />,
		},
	];
}
