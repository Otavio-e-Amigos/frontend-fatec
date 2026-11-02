import Header from "~/layouts/Header";
import SaveDisciplinaForm from "./@layouts/SaveDisciplinaForm";

export default function AddDisciplinaPage() {
  return (
    <main className="flex flex-1 flex-col">
      <Header activeItem="Disciplinas" />


			<div className="m-5">
      	<SaveDisciplinaForm />
			</div>
    </main>
  );
}
