import Page from "~/pages/professor/add";
import type { Route } from "./+types/edit";
import professors from "~/mock/db/professors.db";
import ProfessorService from "~/modules/professor/professor.service";
import User from "~/modules/user/user.class";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Appointer: Editar Professor" },
    // { name: "description", content: "Projeto PI 3º Semestre." },
  ];
}

export async function clientLoader({ params }: Route.LoaderArgs) {
	const id = Number(params.id);
	const auth = new User(JSON.parse(localStorage.getItem("auth") as string))
	const prof = await ProfessorService.get(id, auth);
	return { prof };
}

export default function Edit({ loaderData }: Route.ComponentProps) {
	// return <Page />
	if (!loaderData.prof) {
		return <p>Insert not found page here</p>
	}
	return <Page professor={loaderData.prof}/>
}
