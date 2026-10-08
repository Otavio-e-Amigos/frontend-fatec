import { useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router";
import DefaultTableModel from "~/classes/TableModels/DefaultTableModel";
import FormInput from "~/components/forms/FormInput";
import ComplexTableModelView from "~/components/tables/ComplexTableView";
import Header from "~/layouts/Header";
import PageSection from "~/layouts/PageSection.layout";
import DisciplinaService from "~/modules/disciplina/disciplina.service";
import type Disciplina from "~/modules/disciplina/disciplina.class";
import User from "~/modules/user/user.class";

export default function DisciplinaIndexPage({ list }: { list: Disciplina[] }) {
	const navigate = useNavigate();
	const [table, setTable] = useState(makeTable(list));

	async function remove(id: number) {
		const auth = new User(JSON.parse(localStorage.getItem("auth") ?? "{}"));
		const deleted = await DisciplinaService.delete(id, auth);

		if (deleted) navigate(0);
	}

	function search(event: ChangeEvent<HTMLInputElement>) {
		const term = event.currentTarget.value.toLowerCase().trim();
		if (!term) {
			setTable(makeTable(list));
			return;
		}
		const filteredList = list.filter((item) =>
			[item.nome, item.codigo, item.sigla].some((value) =>
				value ? value.toLowerCase().includes(term) : false,
			),
		);

		setTable(makeTable(filteredList));
	}

	function makeTable(items: Disciplina[]) {
		const rows = items.map((item) => [
			{
				value: item.nome ?? "",
				display: (
					<Link className="link" to={`/disciplina/${item.id}`}>
						{item.nome}
					</Link>
				),
			},
			item.codigo ?? "",
			item.sigla ?? "",
			{
				value: "",
				display: (
					<div className="row-actions">
						<Link
							className="btn"
							data-variant="icon"
							data-icon="edit"
							title="Editar"
							to={`/disciplina/${item.id}/edit`}
						>
							Editar
						</Link>
						<button
							className="btn"
							data-variant="icon"
							data-icon="trash"
							title="Excluir"
							onClick={() => remove(item.id!)}
						>
							Excluir
						</button>
					</div>
				),
			},
		]);

		return new DefaultTableModel(rows, [
			"Disciplina",
			"Código",
			"Sigla",
			"",
		]);
	}

	return (
		<div className="flex flex-col flex-1">
			<Header activeItem="Disciplinas" />

			<main className="mx-5 flex flex-1 flex-col">
				<section className="flex flex-row justify-between items-center">
					<PageSection name="Disciplinas" />
					<Link to="add" className="btn h-fit" data-variant="outline" data-size="sm">
						+ Adicionar
					</Link>
				</section>

				<section className="flex flex-row my-4 justify-end">
					<FormInput type="search" name="busca" onChange={search} />
				</section>

				<ComplexTableModelView data={table} />
			</main>
		</div>
	);
}