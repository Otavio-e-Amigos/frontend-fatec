import { Link } from "react-router";
import DefaultTableModel from "~/classes/TableModels/DefaultTableModel";
import ComplexTableModelView from "~/components/tables/ComplexTableView";
import Header from "~/layouts/Header";
// import PageSection from "~/layouts/PageSection.layout";
import type PeriodoLetivo from "~/modules/periodo-letivo/periodo-letivo.class";
import formatPeriodoDate from "~/modules/periodo-letivo/format-date";
import PageHeader from "~/layouts/PageHeader";

export default function PeriodoIndex({ list }: { list: PeriodoLetivo[] }) {
	const table = new DefaultTableModel(
		list.map((item) => [
			{
				value: `${item.ano}/${item.semestre}`,
				display: (
					<Link className="link" to={`/periodo-letivo/${item.id}`}>
						{item.ano}/{item.semestre}
					</Link>
				),
			},
			item.ano ?? "",
			`${item.semestre}º`,
			formatPeriodoDate(item.dataInicio),
			formatPeriodoDate(item.dataFim),
		]),
		["Período", "Ano", "Semestre", "Início", "Fim"],
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
					{/*<Link className="btn" data-variant="outline" data-size="sm" to="add">
						+ Adicionar
					</Link>*/}
				</section>
				<section className="my-4">
					<ComplexTableModelView data={table} />
				</section>
			</main>
		</div>
	);
}
