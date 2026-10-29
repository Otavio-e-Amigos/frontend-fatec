import { useState } from "react";
import { useRevalidator } from "react-router";
import DefaultTableModel from "~/classes/TableModels/DefaultTableModel";
import FormDialog from "~/components/dialogs/FormDialog";
import ComplexTableModelView from "~/components/tables/ComplexTableView";
import Header from "~/layouts/Header";
import PageHeader from "~/layouts/pages/PageHeader";
import type Curso from "~/modules/curso/curso.class";
import formatTurno from "~/modules/curso/format-turno";
import SaveCursoForm from "./@layouts/SaveCursoForm";

export default function CursoIndexPage({ list }: { list: Curso[] }) {
	const { revalidate } = useRevalidator();
	// undefined = fechado | null = novo curso | Curso = editando
	const [editing, setEditing] = useState<Curso | null | undefined>(undefined);

	const table = new DefaultTableModel(
		list.map((curso) => [
			curso.nome ?? "",
			curso.sigla ?? "",
			formatTurno(curso.turno),
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
							onClick={() => setEditing(curso)}
						>
							Editar
						</button>
					</div>
				),
			},
		]),
		["Curso", "Sigla", "Turno", "Ações"],
	);

	return (
		<div className="flex flex-col flex-1">
			<Header activeItem="Cursos" />

			<main className="mx-5 my-4 flex flex-1 flex-col gap-3">
				<section className="flex flex-row justify-between items-center">
					<PageHeader
						title={"Cursos"}
						subTitle={"Recursos Acadêmicos"}
						description={"Visualize os cursos cadastrados dentro do sistema"}
						headerItems={
							<button
								type="button"
								className="btn w-fit"
								data-variant="outline"
								data-size="sm"
								onClick={() => setEditing(null)}
							>
								+ Novo Curso
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
					<SaveCursoForm
						key={editing?.id ?? "novo"}
						curso={editing ?? undefined}
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
