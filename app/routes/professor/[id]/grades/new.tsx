import { redirect } from "react-router";
import type { Route } from "./+types/new";
import GradeWizard from "~/pages/grade/GradeWizard";
import CursoService from "~/modules/curso/curso.service";
import DisciplinaService from "~/modules/disciplina/disciplina.service";
import GradeService from "~/modules/grade/grade.service";
import PeriodoLetivoService from "~/modules/periodo-letivo/periodo-letivo.service";
import ProfessorService from "~/modules/professor/professor.service";
import AuthService from "~/modules/user/auth.service";

export function meta() {
	return [{ title: "Appointer: Criar grade horária" }];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	if (!AuthService.hasUserToken()) throw redirect("/login");

	const professorId = Number(params.id);
	if (!Number.isSafeInteger(professorId) || professorId < 1) {
		throw new Response("Professor não encontrado.", { status: 404 });
	}

	const auth = AuthService.getUserToken();
	const opOptionsPromise: Promise<{ options: number[]; error?: string }> =
		GradeService.getOpOptions(professorId, auth)
			.then((options) => ({ options }))
			.catch((error: unknown) => ({
				options: [],
				error:
					error instanceof Error
						? error.message
						: "Erro ao consultar os valores já cadastrados.",
			}));
	const [professor, cursos, disciplinas, periodos, opResult] = await Promise.all([
		ProfessorService.get(professorId, auth),
		CursoService.get(auth),
		DisciplinaService.getAllForGrade(auth),
		PeriodoLetivoService.get(auth),
		opOptionsPromise,
	]);

	if (!professor) throw new Response("Professor não encontrado.", { status: 404 });

	return {
		professor,
		cursos,
		disciplinas,
		periodos,
		opOptions: opResult.options,
		opOptionsError: "error" in opResult ? opResult.error : undefined,
	};
}

export default function NewProfessorGrade({ loaderData }: Route.ComponentProps) {
	return <GradeWizard {...loaderData} />;
}

export function HydrateFallback() {
	return (
		<main className="grid min-h-screen place-items-center text-ink-muted">
			Carregando cursos, disciplinas e períodos letivos...
		</main>
	);
}
