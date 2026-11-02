import Index from "~/pages/professor/index";
import ProfessorService from "~/modules/professor/professor.service";
import AuthService from "~/modules/user/auth.service";
import type { Route } from "./+types/index";

export function meta() {
	return [{ title: "Appointer: Professores" }];
}

export async function clientLoader() {
	const auth = AuthService.getUserToken();
	const professors = await ProfessorService.get(auth);

	return { professors };
}

export default function Page({loaderData}: Route.ComponentProps) {


	return <Index list={loaderData.professors} />;
}
