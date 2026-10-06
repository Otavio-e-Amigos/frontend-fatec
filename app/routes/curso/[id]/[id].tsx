import { Link } from "react-router";
import type { Route } from "./+types/[id]";
import About from "~/pages/curso/[id]";

// import professors from "~/mock/db/professors.db";
import CursoService from "~/modules/curso/curso.service";
import User from "~/modules/user/user.class";

export async function clientLoader({ params }: Route.LoaderArgs) {
	const id = Number(params.id);
	const auth = new User(JSON.parse(localStorage.getItem("auth") as string))
	const curso = await CursoService.get(id, auth);
	// const prof = professors.find((prof) => prof.id == id);
	return { curso };
}

export default function Page({ loaderData }: Route.ComponentProps) {
	if (!loaderData.curso) {
		return <p>Insert Not Found Page here</p>
	}
	return (
		<About curso={loaderData.curso} />
	);
}
