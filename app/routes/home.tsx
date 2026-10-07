// import professors from "~/mock/db/professors.db";
import type { Route } from "./+types/home";
import Index from "~/pages";
import ProfessorService from "~/modules/professor/professor.service";
import User from "~/modules/user/user.class";
import { redirect } from "react-router";
import professors from "~/mock/db/professors.db";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Appointer" },
		{ name: "description", content: "Projeto PI 3º Semestre." },
	];
}

export async function clientLoader({}: Route.LoaderArgs) {
	if (!localStorage.getItem("auth")) {
		throw redirect("/login");
	}
	const auth = new User(JSON.parse(localStorage.getItem("auth") as string));

	const list = await ProfessorService.get(auth);
	// const list = professors;
	return { list };
}

export default function Home({ loaderData }: Route.ComponentProps) {
	return <Index professorList={loaderData.list} />;
}
