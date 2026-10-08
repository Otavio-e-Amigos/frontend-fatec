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
          <div className="row-actions">
            <Link
              className="btn"
              data-variant="icon"
              data-icon="edit"
              title="Editar"
              to={`/curso/${curso.id}/edit`}
            >
              Editar
            </Link>
          </div>
        ),
      },
    ]),
    ["Curso", "Sigla", "Turno", "Ações"],
  );

  return (
    <div className="flex flex-col flex-1">
      <Header activeItem="Cursos" />
      <main className="mx-5 flex flex-1 flex-col">
        <section className="flex flex-row justify-between items-center">
          <PageSection name="Cursos" />
          <Link to="add" className="btn h-fit" data-variant="outline" data-size="sm">
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