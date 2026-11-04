import { useState } from "react";
import DefaultTableModel from "~/classes/TableModels/DefaultTableModel";
import ComplexTableModelView from "~/components/tables/ComplexTableView";
import Header from "~/layouts/Header";
import PageHeader from "~/layouts/pages/PageHeader";
import type PeriodoLetivo from "~/modules/periodo-letivo/periodo-letivo.class";
import SavePeriodoForm from "./@layouts/SavePeriodoForm";
import mapper from "./@mappers/periodo-letivo-table.mapper";
import useWindow from "~/components/windows/useWindow";
import { Plus } from "iconoir-react";

export default function PeriodoIndex({ list }: { list: PeriodoLetivo[] }) {
	const window = useWindow({
		wrapper: <SavePeriodoForm />,
		initialData: { dismissible: true },
	});

	const table = new DefaultTableModel(list.map(mapper), [
		"Período",
		"Ano",
		"Semestre",
		"Início",
		"Fim",
		"",
	]);

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
								onClick={() => {
									window.show();
								}}
							>
								<Plus/>
								<p>Novo Período Letivo</p>
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
