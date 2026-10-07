import { useNavigate } from "react-router";
import Header from "~/layouts/Header";
import saveCurso from "~/modules/curso/actions/save.action";
import SaveCursoFrom from "./@layouts/SaveCursoForm";
import type Curso from "~/modules/curso/curso.class";

export default function EditCursoPage({ curso }: { curso: Curso }) {
  const navigate = useNavigate();
  return (
    <main className="flex flex-1 flex-col">
      <Header activeItem="Cursos" />
      <h1 className="text-4xl my-5 mx-2">Editar Cursos</h1>
      <SaveCursoFrom
        curso={curso}
        onSubmit={async (event: any) => {
          if (await saveCurso(event, curso.id)) navigate("/curso");
        }}
      />
    </main>
  );
}
