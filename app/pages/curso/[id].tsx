import { Link } from "react-router";
import Header from "~/layouts/Header";
import type Curso from "~/modules/curso/curso.class";

export default function CursoDetailsPage({ curso }: { curso: Curso }) {
  return (
    <div className="flex flex-1 flex-col">
      <Header activeItem="Cursos" />
      <main className="m-5">
        <h1 className="text-4xl">{curso.nome}</h1>
        <p>
          <b>Turno:</b> {curso.turno}
        </p>
        <p>
          <b>Sigla:</b> {curso.sigla}
        </p>
        <Link className="btn btn-normal mt-5" to={`/curso/${curso.id}/edit`}>
          Editar
        </Link>
      </main>
    </div>
  );
}
