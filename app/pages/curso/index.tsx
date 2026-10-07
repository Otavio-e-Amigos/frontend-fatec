import { Link } from "react-router";
import DefaultTableModel from "~/classes/TableModels/DefaultTableModel";
import ComplexTableModelView from "~/components/tables/ComplexTableView";
import Header from "~/layouts/Header";
import PageSection from "~/layouts/PageSection.layout";
import type Curso from "~/modules/curso/curso.class";

export default function CursoIndexPage({ list }: { list: Curso[] }) {
  const table = new DefaultTableModel(
    list.map((curso) => [
      {
        value: curso.nome ?? "",
        display: (
          <Link className="link" to={`/curso/${curso.id}`}>
            {curso.nome}
          </Link>
        ),
      },
      curso.sigla ?? "",
      curso.turno ?? "",
      {
        value: "",
        display: (
          <Link className="btn btn-normal" to={`/curso/${curso.id}/edit`}>
            Editar
          </Link>
        ),
      },
    ]),
    ["Curso", "Sigla", "Turno", "Ação"],
  );

  return (
    <div className="flex flex-col flex-1">
      <Header activeItem="Cursos" />
      <main className="mx-5 flex flex-1 flex-col">
        <section className="flex flex-row justify-between items-center">
          <PageSection name="Cursos" />
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
