import { Link } from "react-router";
import type Professor from "~/modules/professor/professor.class";

function RowActions({
	prof,
	deactivate,
	activate,
}: {
	prof: Professor;
	deactivate: any;
	activate: any;
}) {
	return (
		<div key={prof.id} className="row-actions">
			<Link
				className="btn"
				data-variant="icon"
				data-icon="edit"
				title="Editar"
				to={`/professor/${prof.id}/edit`}
			>
				Editar
			</Link>
			<button
				type="button"
				className="btn"
				data-variant="icon"
				data-icon="power"
				title={prof.status === "ATIVO" ? "Desativar" : "Ativar"}
				onClick={() =>
					prof.status === "ATIVO" ? void deactivate(prof) : void activate(prof)
				}
			>
				{prof.status === "ATIVO" ? "Desativar" : "Ativar"}
			</button>
		</div>
	);
}

function ProfessorNameDisplay({ prof }: {
	prof: Professor
}) {
	return (
		<Link key={prof.id} className="link" to={`/professor/${prof.id}`}>
			{prof.name}
		</Link>
	)
}

export default function mapper(
	prof: Professor,
	deactivate: any,
	activate: any,
) {
	return [
		{
			value: prof.name,
			display: <ProfessorNameDisplay prof={prof}/>,
		},
		prof.registry,
		prof.contract,
		prof.status,
		{
			value: 0,
			display: <RowActions prof={prof} deactivate={deactivate} activate={activate} />,
		},
	];
}
