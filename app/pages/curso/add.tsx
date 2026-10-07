import { useNavigate } from "react-router";
import saveCurso from "~/modules/curso/actions/save.action";
import SaveCursoFrom from "./@layouts/SaveCursoForm";
import Header from "~/layouts/Header";

export default function AddCursoPage() {
  const navigate = useNavigate();
  return (
    <main className="flex flex-1 flex-col">
      <Header activeItem="Cursos" />
      <h1 className="text-4xl my-5 mx-2">Adicionar curso</h1>
      <SaveCursoFrom
        onSubmit={async (event: any) => {
          if (await saveCurso(event)) navigate("/curso");
        }}
      />
    </main>
  );
}
