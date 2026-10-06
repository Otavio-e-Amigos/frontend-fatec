import Page from "~/pages/curso/add";
import type { Route } from "./+types/edit";
// import professors from "~/mock/db/professors.db";
import CursoService from "~/modules/curso/curso.service";
import User from "~/modules/user/user.class";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Appointer: Editar Curso" },
    // { name: "description", content: "Projeto PI 3º Semestre." },
  ];
}

export async function clientLoader({ params }: Route.LoaderArgs) {
	const id = Number(params.id);
	const auth = new User(JSON.parse(localStorage.getItem("auth") as string))
	const curso = await CursoService.get(id, auth);
	return { curso };
}

export default function Edit({ loaderData }: Route.ComponentProps) {
	// return <Page />
	if (!loaderData.curso) {
		return <p>Insert not found page here</p>
	}
	return <Page curso={loaderData.curso}/>
}
