import { Link } from "react-router";
import Header from "~/layouts/Header";
import type Disciplina from "~/modules/disciplina/disciplina.class";

export default function DisciplinaDetailsPage({
  disciplina,
}: {
  disciplina: Disciplina;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <Header activeItem="Disciplinas" />
      <main className="m-5">
        <h1 className="text-4xl">{disciplina.nome}</h1>
        <p>
          <b>Código:</b> {disciplina.codigo}
        </p>
        <p>
          <b>Sigla:</b> {disciplina.sigla}
        </p>
        <Link
          className="btn btn-normal mt-5"
          to={`/disciplina/${disciplina.id}/edit`}
        >
          Editar
        </Link>
      </main>
    </div>
  );
}
