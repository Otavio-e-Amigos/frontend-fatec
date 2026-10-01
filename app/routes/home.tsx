// import professors from "~/mock/db/professors.db";
import type { Route } from "./+types/home";
import Index from "~/pages";
import ProfessorService from "~/modules/professor/professor.service";
import User from "~/modules/user/user.class";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Appointer" },
		{ name: "description", content: "Projeto PI 3º Semestre." },
	];
}

export async function clientLoader({ }: Route.LoaderArgs) {
	const auth = new User(JSON.parse(localStorage.getItem("auth") as string))
	const list = await ProfessorService.get(auth);
	return { list };
}

export default function Home({ loaderData }: Route.ComponentProps) {
	return <Index professorList={loaderData.list} />;
}
