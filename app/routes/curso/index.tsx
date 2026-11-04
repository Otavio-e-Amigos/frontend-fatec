import type { Route } from "./+types/index";
import CursoService from "~/modules/curso/curso.service";
import AuthService from "~/modules/user/auth.service";
import Page from "~/pages/curso/index";

export async function clientLoader({ request }: Route.ClientLoaderArgs) {

	const url = new URL(request.url)

	return {
		cursos: await CursoService.get(AuthService.getUserToken()),
		initial: {
			addResourceWindow: Boolean(url.searchParams.get("add")) ?? false
		}
	};
}
export default function CursoIndexRoute({ loaderData }: Route.ComponentProps) {
	return <Page list={loaderData.cursos} initial={loaderData.initial} />;
}
