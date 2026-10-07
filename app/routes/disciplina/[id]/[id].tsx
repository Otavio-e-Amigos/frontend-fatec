import type { Route } from "./+types/[id]";
import DisciplinaService from "~/modules/disciplina/disciplina.service";
import User from "~/modules/user/user.class";
import Page from "~/pages/disciplina/[id]";

export async function clientLoader({ params }: Route.LoaderArgs) {
	const auth = new User(JSON.parse(localStorage.getItem("auth") ?? "{}"));
	return { disciplina: await DisciplinaService.get(Number(params.id), auth) };
}

export default function DisciplinaDetailsRoute({ loaderData }: Route.ComponentProps) {
	return loaderData.disciplina ? <Page disciplina={loaderData.disciplina} /> : <p>Disciplina não encontrada.</p>;
}
