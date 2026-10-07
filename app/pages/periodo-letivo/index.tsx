import { Link } from "react-router";
import DefaultTableModel from "~/classes/TableModels/DefaultTableModel";
import ComplexTableModelView from "~/components/tables/ComplexTableView";
import Header from "~/layouts/Header";
import PageSection from "~/layouts/PageSection.layout";
import type PeriodoLetivo from "~/modules/periodo-letivo/periodo-letivo.class";
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
      item.dataInicio ?? "",
      item.dataFim ?? "",
    ]),
    ["Período", "Ano", "Semestre", "Início", "Fim"]
  );

  return (
    <div className="flex flex-col flex-1">
      <Header activeItem="Períodos" />
      <main className="mx-5 flex flex-1 flex-col">
        <section className="flex flex-row justify-between items-center">
          <PageSection name="Períodos letivos" />
          <Link to="add" className="btn btn-success h-fit">
            + Adicionar
          </Link>
        </section>
        <section className="my-4">
          <ComplexTableModelView data={table} />
        </section>
      </main>
    </div>
  );
}
