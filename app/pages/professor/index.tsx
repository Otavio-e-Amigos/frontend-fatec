import { useMemo, useState } from "react";
import { Link } from "react-router";
import DefaultTableModel from "~/classes/TableModels/DefaultTableModel";
import FormInput from "~/components/forms/FormInput";
import ComplexTableModelView from "~/components/tables/ComplexTableView";
import Header from "~/layouts/Header";
import PageHeader from "~/layouts/pages/PageHeader";
import type Professor from "~/modules/professor/professor.class";
import mapper from "./@mappers/professor-table.mapper";
import filter from "./@filters/professor-table.filter";
// import { Search } from "iconoir-react";
import { Plus } from "iconoir-react";

export default function Page({ list }: { list: Professor[] }) {
	const [term, setTerm] = useState("");

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
		<div className="flex flex-col flex-1">
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
							<Plus/>
							<p>Novo Professor</p>
						</Link>
					}
				/>

				<section className="flex flex-row my-4 justify-end items-center gap-5">
					<FormInput
						type="search"
						name={"search"}
						placeholder="Pesquisar..."
						onChange={(event: any) =>
							setTerm(event.currentTarget.value.toLowerCase().trim())
						}
					/>
				</section>

				<ComplexTableModelView data={professorsTable} />
			</main>
		</div>
	);
}
