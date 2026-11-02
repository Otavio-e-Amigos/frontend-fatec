import { useNavigate } from "react-router";
import SaveCursoFrom from "./@layouts/SaveCursoForm";
import Header from "~/layouts/Header";

export default function AddCursoPage() {
  return (
    <main className="flex flex-1 flex-col">
      <Header activeItem="Cursos" />

			<div className="m-5">
      	<SaveCursoFrom />
			</div>
    </main>
  );
}
