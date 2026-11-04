import { redirect } from "react-router";
import GradeImportPage from "~/pages/grade/import";
import type { GradePageProps } from "~/pages/grade/grade-page.types";
import CursoService from "~/modules/curso/curso.service";
import DisciplinaService from "~/modules/disciplina/disciplina.service";
import PeriodoLetivoService from "~/modules/periodo-letivo/periodo-letivo.service";
import ProfessorService from "~/modules/professor/professor.service";
import AuthService from "~/modules/user/auth.service";

export function meta() {
	return [{ title: "Appointer: Importar grade" }];
}

export async function clientLoader(): Promise<GradePageProps> {
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

export default function GradeImport({ loaderData }: { loaderData: GradePageProps }) {
	return <GradeImportPage {...loaderData} />;
}