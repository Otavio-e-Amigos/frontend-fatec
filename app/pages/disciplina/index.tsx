import { useMemo, useState, type ChangeEvent } from "react";
import DefaultTableModel from "~/classes/TableModels/DefaultTableModel";
import FormInput from "~/components/forms/FormInput";
import ComplexTableModelView from "~/components/tables/ComplexTableView";
import Header from "~/layouts/Header";
import PageHeader from "~/layouts/pages/PageHeader";
import type Disciplina from "~/modules/disciplina/disciplina.class";
import SaveDisciplinaForm from "./@layouts/SaveDisciplinaForm";
import useWindow from "~/components/windows/useWindow";
import mapper from "./@mappers/discipline-table.mapper";
import { Plus } from "iconoir-react";

export default function DisciplinaIndexPage({ list }: { list: Disciplina[] }) {
	const [term, setTerm] = useState("");
	const window = useWindow();

	const filtered = useMemo(() => {
		if (!term) return list;
		return list.filter((item) =>
			[item.nome, item.codigo, item.sigla].some((value) =>
				value ? value.toLowerCase().includes(term) : false,
			),
		);
	}, [list, term]);

	function search(event: ChangeEvent<HTMLInputElement>) {
		setTerm(event.currentTarget.value.toLowerCase().trim());
	}

	const table = useMemo(() => {
		const rows = filtered.map(mapper);
		return new DefaultTableModel(rows, ["Disciplina", "Código", "Sigla", ""]);
	}, [filtered]);

	return (
		<div className="flex flex-col flex-1">
			<Header activeItem="Disciplinas" />

			<main className="mx-5 my-4 flex flex-1 flex-col gap-3">
				<section className="flex flex-row justify-between items-center">
					<PageHeader
						title={"Disciplinas"}
						subTitle={"Recursos Acadêmicos"}
						description={
							"Visualize as disciplinas existentes para a criação das grades"
						}
						headerItems={
							<button
								type="button"
								className="btn w-fit"
								data-variant="outline"
								data-size="sm"
								onClick={() => {
									window.show({ dismissible: true }, <SaveDisciplinaForm />);
								}}
							>
								<Plus/>
								<p>Nova Disciplina</p>
							</button>
						}
					/>
				</section>

				<section className="flex flex-row my-4 justify-end">
					<FormInput
						type="search"
						name="busca"
						placeholder="Pesquisar..."
						onChange={search}
					/>
				</section>

				<ComplexTableModelView data={table} />
			</main>
		</div>
	);
}
