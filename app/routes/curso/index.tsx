import Index from "~/pages/disciplina/index";
// import { auth } from "~/mock/db/users.db";
import { useEffect, useState } from "react";
import User from "~/modules/user/user.class";
import type { Route } from "./+types/index";
import CursoService from "~/modules/curso/curso.service";

export function meta() {
	return [{ title: "Appointer: Curso" }];
}

export async function clientLoader() {
	const auth = new User(JSON.parse(localStorage.getItem("auth") as string))
	const course = await CursoService.get(auth);

	// const prof = professors.find((prof) => prof.id == id);
	return { course };
}

export default function Page({loaderData}: Route.ComponentProps) {
	// const [professors, setProfessors] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const auth = new User(JSON.parse(localStorage.getItem("auth") as string))


	return <Index list={loaderData.course} />;
}
