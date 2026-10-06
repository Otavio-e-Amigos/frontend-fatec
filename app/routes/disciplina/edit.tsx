import Page from "~/pages/disciplina/add";
import type { Route } from "./+types/edit";
// import professors from "~/mock/db/professors.db";
import DisciplinaService from "~/modules/disciplina/disciplina.service";
import User from "~/modules/user/user.class";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Appointer: Editar Disciplina" },
    // { name: "description", content: "Projeto PI 3º Semestre." },
  ];
}

export async function clientLoader({ params }: Route.LoaderArgs) {
	const id = Number(params.id);
	const auth = new User(JSON.parse(localStorage.getItem("auth") as string))
	const disciplina = await DisciplinaService.get(id, auth);
	return { disciplina };
}

export default function Edit({ loaderData }: Route.ComponentProps) {
	// return <Page />
	if (!loaderData.disciplina) {
		return <p>Insert not found page here</p>
	}
	return <Page disciplina={loaderData.subject}/>
}
