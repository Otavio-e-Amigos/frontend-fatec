import Index from "~/pages/disciplina/index";
// import { auth } from "~/mock/db/users.db";
import { useEffect, useState } from "react";
import User from "~/modules/user/user.class";
import type { Route } from "./+types/index";
import DisciplinaService from "~/modules/disciplina/disciplina.service";

export function meta() {
	return [{ title: "Appointer: Disciplina" }];
}

export async function clientLoader() {
	const auth = new User(JSON.parse(localStorage.getItem("auth") as string))
	const subject = await DisciplinaService.get(auth);

	// const prof = professors.find((prof) => prof.id == id);
	return { subject };
}

export default function Page({loaderData}: Route.ComponentProps) {
	// const [professors, setProfessors] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const auth = new User(JSON.parse(localStorage.getItem("auth") as string))


	return <Index list={loaderData.subject} />;
}
