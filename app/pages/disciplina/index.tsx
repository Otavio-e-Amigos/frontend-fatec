import { useMemo, useState, type ChangeEvent } from "react";
import { useRevalidator } from "react-router";
import DefaultTableModel from "~/classes/TableModels/DefaultTableModel";
import FormDialog from "~/components/dialogs/FormDialog";
import FormInput from "~/components/forms/FormInput";
import ComplexTableModelView from "~/components/tables/ComplexTableView";
import useDialogs from "~/hooks/useDialogs";
import Header from "~/layouts/Header";
import PageHeader from "~/layouts/pages/PageHeader";
import type Disciplina from "~/modules/disciplina/disciplina.class";
import DisciplinaService from "~/modules/disciplina/disciplina.service";
import AuthService from "~/modules/user/auth.service";
import SaveDisciplinaForm from "./@layouts/SaveDisciplinaForm";
import useWindow from "~/components/windows/useWindow";
import deactivateWindow from "./@windows/deactivate.window";

export default function DisciplinaIndexPage({ list }: { list: Disciplina[] }) {
	const dialogs = useDialogs();
	const { revalidate } = useRevalidator();
	const [term, setTerm] = useState("");
	// undefined = fechado | null = nova disciplina | Disciplina = editando
	const [editing, setEditing] = useState<Disciplina | null | undefined>(
		undefined,
	);
	const window = useWindow(deactivateWindow);

	const filtered = useMemo(() => {
		if (!term) return list;
		return list.filter((item) =>
			[item.nome, item.codigo, item.sigla].some((value) =>
				value ? value.toLowerCase().includes(term) : false,
			),
		);
	}, [list, term]);

	async function removeDiscipline(item: Disciplina) {
		window.show({
			...deactivateWindow.initialData,
			description: `A disciplina ${item.nome ?? ""} será excluída. Esta ação não pode ser desfeita.`,
			tone: "danger",
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

	function search(event: ChangeEvent<HTMLInputElement>) {
		setTerm(event.currentTarget.value.toLowerCase().trim());
	}

	const table = useMemo(() => {
		const rows = filtered.map((item) => [
			item.nome ?? "",
			item.codigo ?? "",
			item.sigla ?? "",
			{
				value: "",
				display: (
					<div className="row-actions">
						<button
							type="button"
							className="btn"
							data-variant="icon"
							data-icon="edit"
							title="Editar"
							onClick={() => setEditing(item)}
						>
							Editar
						</button>
						<button
							type="button"
							className="btn"
							data-variant="icon"
							data-icon="delete"
							title="Excluir"
							onClick={() => removeDiscipline(item)}
						>
							Excluir
						</button>
					</div>
				),
			},
		]);
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
								onClick={() => setEditing(null)}
							>
								+ Nova Disciplina
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

			{editing !== undefined && (
				<FormDialog onClose={() => setEditing(undefined)}>
					<SaveDisciplinaForm
						key={editing?.id ?? "nova"}
						disciplina={editing ?? undefined}
						onSaved={() => {
							setEditing(undefined);
							revalidate();
						}}
					/>
				</FormDialog>
			)}
		</div>
	);
}
