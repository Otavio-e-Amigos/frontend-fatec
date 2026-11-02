import useWindow from "~/components/windows/useWindow";
import type { WindowAPIConstructor } from "~/components/windows/window.types";
import type Disciplina from "~/modules/disciplina/disciplina.class";
import formatTurno from "~/modules/curso/format-turno";
import type Curso from "~/modules/curso/curso.class";

function RowActions({ item }: { item: Disciplina }) {
	const windowData: WindowAPIConstructor = {
		dismissible: true,
	};

	const window = useWindow({
		initialData: windowData,
	});

	function edit() {
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
			display: <RowActions item={curso} />,
		},
	];
}
