import { useNavigate } from "react-router";
import saveDisciplina from "~/modules/disciplina/actions/save.action";
import Header from "~/layouts/Header";
import SaveDisciplinaForm from "./@layouts/SaveDisciplinaForm";

export default function AddDisciplinaPage() {
  const navigate = useNavigate();
  return (
    <main className="flex flex-1 flex-col">
      <Header activeItem="Disciplinas" />
      <h1 className="text-4xl my-5 mx-2">Adicionar disciplina</h1>
      <SaveDisciplinaForm
        onSubmit={async (event: any) => {
          if (await saveDisciplina(event)) navigate("/disciplina");
        }}
      />
    </main>
  );
}
