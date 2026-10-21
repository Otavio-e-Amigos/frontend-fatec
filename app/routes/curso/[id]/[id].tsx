import type { Route } from "./+types/[id]";
import CursoService from "~/modules/curso/curso.service";
import AuthService from "~/modules/user/auth.service";
import Page from "~/pages/curso/[id]/[id]";

export async function clientLoader({ params }: Route.LoaderArgs) {
	const auth = AuthService.getUserToken();
	return { curso: await CursoService.get(Number(params.id), auth) };
}

export default function CursoDetailsRoute({ loaderData }: Route.ComponentProps) {
	return loaderData.curso ? <Page curso={loaderData.curso} /> : <p className="m-5">Curso não encontrado.</p>;
}
