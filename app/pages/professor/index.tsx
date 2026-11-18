import { useMemo, useState, type FunctionComponent } from "react";
import { Link } from "react-router";
import DefaultTableModel from "~/classes/TableModels/DefaultTableModel";
// import FormInput from "~/components/forms/FormInput";
import ComplexTableModelView from "~/components/tables/ComplexTableView";
import Header from "~/layouts/Header";
import PageHeader from "~/layouts/pages/PageHeader";
import type Professor from "~/modules/professor/professor.class";
import mapper from "./@mappers/professor-table.mapper";
import filter from "./@filters/professor-table.filter";
// import { Search } from "iconoir-react";
import { Plus } from "iconoir-react";
import GenericFloor from "~/layouts/pages/GenericFloor";
// import FloorHeader from "~/layouts/pages/FloorHeader";
import SearchBarHeader from "~/layouts/pages/SearchBarHeader";

export default function Page({ list }: { list: Professor[] }) {
	const [term, setTerm] = useState("");
	const [displayTerm, setDisplayTerm] = useState("");

	const filtered = useMemo(() => {
		if (!term) return list;
		return list.filter((prof) => filter(prof, term));
	}, [list, term]);

	const professorsTable = useMemo(() => {
		const rows = filtered.map(mapper);

		return new DefaultTableModel(rows as any, [
			"Docente",
			"Matrícula",
			"Tipo de Contrato",
			"Status",
			"",
		]);
	}, [filtered]);

	return (
		<div className="flex flex-1 flex-col">
			<Header activeItem="Professores" />

			<main className="mx-5 my-4 flex flex-1 flex-col gap-3">
				<PageHeader
					title={"Professores"}
					subTitle={"Recursos Acadêmicos"}
					description={
						"Explore e visualize as opções disponíveis para cada docente"
					}
					headerItems={
						<Link
							className="btn w-fit"
							data-variant="outline"
							data-size="sm"
							to="add"
						>
							<Plus />
							<p>Novo Professor</p>
						</Link>
					}
				/>

				<GenericFloor
					className="p-4 flex-1"
					header={
						<SearchBarHeader
							title={
								displayTerm
									? `Resultados de: "${displayTerm}"`
									: "Consulta de Docentes"
							}
							description={
								professorsTable.getRows().length > 0
									? `Listando: ${professorsTable.getRows().length} docentes`
									: "Nenhum Professor encontrado."
							}
							termStateSetter={setTerm}
							displayTermStateSetter={setDisplayTerm}
						/>
					}
					wrapperClassName="flex-1"
				>
					<ComplexTableModelView data={professorsTable} />
				</GenericFloor>
			</main>
		</div>
	);
}
