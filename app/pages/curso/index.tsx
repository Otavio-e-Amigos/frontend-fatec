import DefaultTableModel from "~/classes/TableModels/DefaultTableModel";
import ComplexTableModelView from "~/components/tables/ComplexTableView";
import Header from "~/layouts/Header";
import PageHeader from "~/layouts/pages/PageHeader";
import type Curso from "~/modules/curso/curso.class";
import mapper from "./@mappers/curso-table.mapper";
import useWindow from "~/components/windows/useWindow";
import SaveCursoForm from "./@layouts/SaveCursoForm";
import { Plus } from "iconoir-react";

export default function CursoIndexPage({ list, initial }: { list: Curso[], initial:any }) {
	const window = useWindow({
		wrapper: <SaveCursoForm />,
	});
	const table = new DefaultTableModel(list.map(mapper), [
		"Curso",
		"Sigla",
		"Turno",
		"Ações",
	]);

	if (initial && initial.addResourceWindow) {
		window.show()
	}

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
								onClick={() => {
									window.show();
								}}
							>
								<Plus/>
								Novo Curso
							</button>
						}
					/>
				</section>
				<section className="my-4">
					<ComplexTableModelView data={table} />
				</section>
			</main>
		</div>
	);
}
