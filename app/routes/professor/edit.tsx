import Page from "~/pages/professor/add";
import type { Route } from "./+types/edit";
import professors from "~/mock/db/professors.db";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Appointer: Editar Professor" },
    // { name: "description", content: "Projeto PI 3º Semestre." },
  ];
}

export async function clientLoader({ params }: Route.LoaderArgs) {
	const id = Number(params.id);
	const prof = professors.find((prof) => prof.id == id);
	return { prof };
}

export default function Edit({ loaderData }: Route.ComponentProps) {
	// return <Page />
	if (!loaderData.prof) {
		return <p>Insert not found page here</p>
	}
	return <Page professor={loaderData.prof}/>
}
