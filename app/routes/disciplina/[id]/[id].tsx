import type { Route } from "./+types/[id]";
import DisciplinaService from "~/modules/disciplina/disciplina.service";
import AuthService from "~/modules/user/auth.service";
import Page from "~/pages/disciplina/[id]/[id]";

export async function clientLoader({ params }: Route.LoaderArgs) {
	const auth = AuthService.getUserToken();
	return { disciplina: await DisciplinaService.get(Number(params.id), auth) };
}

export default function DisciplinaDetailsRoute({ loaderData }: Route.ComponentProps) {
	return loaderData.disciplina ? <Page disciplina={loaderData.disciplina} /> : <p>Disciplina não encontrada.</p>;
}
