import type { Route } from "./+types/[id]";
import About from "~/pages/professor/[id]/[id]";
import CursoService from "~/modules/curso/curso.service";
import DisciplinaService from "~/modules/disciplina/disciplina.service";
import PeriodoLetivoService from "~/modules/periodo-letivo/periodo-letivo.service";
import ProfessorService from "~/modules/professor/professor.service";
import AuthService from "~/modules/user/auth.service";

export async function clientLoader({ params }: Route.LoaderArgs) {
	const id = Number(params.id);
	const auth = AuthService.getUserToken();

	// Períodos, cursos e disciplinas servem para mostrar os nomes na grade.
	// Se alguma dessas listas falhar, o perfil abre mesmo assim (nomes genéricos).
	const [prof, periodos, cursos, disciplinas] = await Promise.all([
		ProfessorService.get(id, auth),
		PeriodoLetivoService.get(auth).catch(() => []),
		CursoService.get(auth).catch(() => []),
		DisciplinaService.getAllForGrade(auth).catch(() => []),
	]);

	return { prof, periodos, cursos, disciplinas };
}

export default function Page({ loaderData }: Route.ComponentProps) {
	const { prof, periodos, cursos, disciplinas } = loaderData;

	if (!prof) {
		return <p>Insert Not Found Page here</p>;
	}

	return (
		<About
			professor={prof}
			periodos={periodos}
			cursos={cursos}
			disciplinas={disciplinas}
		/>
	);
}