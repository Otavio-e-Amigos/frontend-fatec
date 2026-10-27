import { redirect } from "react-router";
import type { Route } from "./+types/index";
import FolhaPontoPage from "~/pages/folha-ponto";
import CursoService from "~/modules/curso/curso.service";
import DisciplinaService from "~/modules/disciplina/disciplina.service";
import PeriodoLetivoService from "~/modules/periodo-letivo/periodo-letivo.service";
import ProfessorService from "~/modules/professor/professor.service";
import AuthService from "~/modules/user/auth.service";

export function meta() {
	return [{ title: "Appointer: Folha de Ponto" }];
}

export async function clientLoader(_args: Route.ClientLoaderArgs) {
	if (!AuthService.hasUserToken()) throw redirect("/login");
	const auth = AuthService.getUserToken();
	const [professores, periodos, cursos, disciplinas] = await Promise.all([
		ProfessorService.get(auth),
		PeriodoLetivoService.get(auth),
		CursoService.get(auth),
		DisciplinaService.getAllForGrade(auth),
	]);
	return { professores, periodos, cursos, disciplinas };
}

export default function FolhaPontoIndex({ loaderData }: Route.ComponentProps) {
	return <FolhaPontoPage {...loaderData} />;
}