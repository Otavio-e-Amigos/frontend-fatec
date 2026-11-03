import { redirect } from "react-router";
import type { Route } from "./+types/index";
import FolhaPontoPage from "~/pages/folha-ponto";
import ProfessorService from "~/modules/professor/professor.service";
import AuthService from "~/modules/user/auth.service";

export function meta() {
	return [{ title: "Appointer: Folha de Ponto" }];
}

export async function clientLoader(_args: Route.ClientLoaderArgs) {
	if (!AuthService.hasUserToken()) throw redirect("/login");

	const professores = await ProfessorService.get(AuthService.getUserToken());
	professores.sort((a, b) =>
		(a.name ?? "").localeCompare(b.name ?? "", "pt-BR"),
	);

	return { professores };
}

export default function FolhaPontoIndex({ loaderData }: Route.ComponentProps) {
	return <FolhaPontoPage {...loaderData} />;
}