import Index from "~/pages/professor/index";
import ProfessorService from "~/modules/professor/professor.service";
// import { useState } from "react";
import AuthService from "~/modules/user/auth.service";
import type { Route } from "./+types/index";

export function meta() {
	return [{ title: "Appointer: Professores" }];
}

export async function clientLoader() {
	const auth = AuthService.getUserToken();
	const professors = await ProfessorService.get(auth);

	// const prof = professors.find((prof) => prof.id == id);
	return { professors };
}

export default function Page({loaderData}: Route.ComponentProps) {
	// const [professors, setProfessors] = useState<any[]>([]);
	// const [loading, setLoading] = useState(true);
	// const [error, setError] = useState<string | null>(null);
	// const auth = AuthService.getUserToken();

	return <Index list={loaderData.professors} />;
}
