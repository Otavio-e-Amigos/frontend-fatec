import { useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router";
import DefaultTableModel from "~/classes/TableModels/DefaultTableModel";
import ConfirmationDialog from "~/components/ConfirmationDialog";
import FormInput from "~/components/forms/FormInput";
import ComplexTableModelView from "~/components/tables/ComplexTableView";
import Header from "~/layouts/Header";
import PageSection from "~/layouts/PageSection.layout";
import DisciplinaService from "~/modules/disciplina/disciplina.service";
import type Disciplina from "~/modules/disciplina/disciplina.class";
import AuthService from "~/modules/user/auth.service";
import PageHeader from "~/layouts/PageHeader";

export default function DisciplinaIndexPage({ list }: { list: Disciplina[] }) {
	const navigate = useNavigate();
	const [table, setTable] = useState(makeTable(list));
	const [disciplineToDelete, setDisciplineToDelete] = useState<Disciplina | null>(null);
	const [deleteError, setDeleteError] = useState<string>();

	async function removeSelectedDiscipline() {
		if (!disciplineToDelete?.id) return;

		try {
			const deleted = await DisciplinaService.delete(
				disciplineToDelete.id,
				AuthService.getUserToken(),
			);
			if (deleted) {
				setDisciplineToDelete(null);
				navigate(0);
			} else {
				setDeleteError("Não foi possível excluir a disciplina. Tente novamente.");
			}
		} catch (error) {
			setDeleteError(
				error instanceof Error
					? error.message
					: "Ocorreu um erro ao excluir a disciplina.",
			);
		}
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
							type="button"
							className="btn"
							data-variant="icon"
							data-icon="delete"
							title="Excluir"
							onClick={() => {
								setDeleteError(undefined);
								setDisciplineToDelete(item);
							}}
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

			<main className="mx-5 my-4 flex flex-1 flex-col gap-3">
			{/*<main className="mx-5 flex flex-1 flex-col">*/}
				<section className="flex flex-row justify-between items-center">
					<PageHeader
						title={"Disciplinas"}
						subTitle={"Recursos Acadêmicos"}
						description={
							"Visualize as disciplinas existentes para a criação das grades"
						}
						headerItems={
							<Link
								className="btn w-fit"
								data-variant="outline"
								data-size="sm"
								to="add"
							>
								+ Novo Período Letivo
							</Link>
						}
					/>
					{/*<PageSection name="Disciplinas" />
					<Link to="add" className="btn h-fit" data-variant="outline" data-size="sm">
						+ Adicionar
					</Link>*/}
				</section>

				<section className="flex flex-row my-4 justify-end">
					<FormInput type="search" name="busca" onChange={search} />
				</section>

				<ComplexTableModelView data={table} />
			</main>
			{disciplineToDelete && (
				<ConfirmationDialog
					title="Excluir disciplina?"
					description={`A disciplina ${disciplineToDelete.nome ?? ""} será excluída. Esta ação não pode ser desfeita.`}
					confirmLabel="Excluir"
					errorMessage={deleteError}
					onConfirm={removeSelectedDiscipline}
					onCancel={() => setDisciplineToDelete(null)}
				/>
			)}
		</div>
	);
}
