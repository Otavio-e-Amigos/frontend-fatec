import type { Route } from "./+types/[id]";
import CursoService from "~/modules/curso/curso.service";
import User from "~/modules/user/user.class";
import Page from "~/pages/curso/[id]";

export async function clientLoader({ params }: Route.LoaderArgs) {
	const auth = new User(JSON.parse(localStorage.getItem("auth") ?? "{}"));
	return { curso: await CursoService.get(Number(params.id), auth) };
}

export default function CursoDetailsRoute({ loaderData }: Route.ComponentProps) {
	return loaderData.curso ? <Page curso={loaderData.curso} /> : <p className="m-5">Curso não encontrado.</p>;
}
