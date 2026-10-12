import { Link } from "react-router";
import type { Route } from "./+types/[id]";
import About from "~/pages/professor/[id]";

// import professors from "~/mock/db/professors.db";
import ProfessorService from "~/modules/professor/professor.service";
import AuthService from "~/modules/user/auth.service";

export async function clientLoader({ params }: Route.LoaderArgs) {
	const id = Number(params.id);
	const auth = AuthService.getUserToken();
	const prof = await ProfessorService.get(id, auth);
	return { prof };
}

export default function Page({ loaderData }: Route.ComponentProps) {
	if (!loaderData.prof) {
		return <p>Insert Not Found Page here</p>
	}
	return (
		<About professor={loaderData.prof} />
	);
}
