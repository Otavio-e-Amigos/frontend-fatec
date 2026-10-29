import { useState } from "react";
import { useRevalidator } from "react-router";
import DefaultTableModel from "~/classes/TableModels/DefaultTableModel";
import FormDialog from "~/components/dialogs/FormDialog";
import ComplexTableModelView from "~/components/tables/ComplexTableView";
import Header from "~/layouts/Header";
import PageHeader from "~/layouts/pages/PageHeader";
import formatPeriodoDate from "~/modules/periodo-letivo/format-date";
import type PeriodoLetivo from "~/modules/periodo-letivo/periodo-letivo.class";
import SavePeriodoForm from "./@layouts/SavePeriodoForm";

export default function PeriodoIndex({ list }: { list: PeriodoLetivo[] }) {
	const { revalidate } = useRevalidator();
	// undefined = fechado | null = novo período | PeriodoLetivo = editando
	const [editing, setEditing] = useState<PeriodoLetivo | null | undefined>(
		undefined,
	);

	const table = new DefaultTableModel(
		list.map((item) => [
			`${item.ano}/${item.semestre}`,
			item.ano ?? "",
			`${item.semestre}º`,
			formatPeriodoDate(item.dataInicio),
			formatPeriodoDate(item.dataFim),
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
					</div>
				),
			},
		]),
		["Período", "Ano", "Semestre", "Início", "Fim", ""],
	);

	return (
		<div className="flex flex-col flex-1">
			<Header activeItem="Períodos" />
			<main className="mx-5 my-4 flex flex-1 flex-col">
				<section className="flex flex-row justify-between items-center">
					<PageHeader
						title={"Períodos Letivos"}
						subTitle={"Recursos Acadêmicos"}
						description={
							"Visualize os períodos letivos cadastrados e crie-os se necessário"
						}
						headerItems={
							<button
								type="button"
								className="btn w-fit"
								data-variant="outline"
								data-size="sm"
								onClick={() => setEditing(null)}
							>
								+ Novo Período Letivo
							</button>
						}
					/>
				</section>
				<section className="my-4">
					<ComplexTableModelView data={table} />
				</section>
			</main>

			{editing !== undefined && (
				<FormDialog onClose={() => setEditing(undefined)}>
					<SavePeriodoForm
						key={editing?.id ?? "novo"}
						periodo={editing ?? undefined}
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
