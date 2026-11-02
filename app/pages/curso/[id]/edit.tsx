import Header from "~/layouts/Header";
import SaveCursoFrom from "../@layouts/SaveCursoForm";
import type Curso from "~/modules/curso/curso.class";

export default function EditCursoPage({ curso }: { curso: Curso }) {
  return (
    <main className="flex flex-1 flex-col">
			<Header activeItem="Cursos" />

			<div className="m-5">
	      <SaveCursoFrom
	        curso={curso}
	      />
			</div>
    </main>
  );
}
