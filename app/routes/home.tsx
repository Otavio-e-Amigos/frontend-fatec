import professors from "~/mock/db/professors.db";
import type { Route } from "./+types/home";
import Index from "~/pages";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Appointer" },
		{ name: "description", content: "Projeto PI 3º Semestre." },
	];
}

export async function clientLoader({}: Route.LoaderArgs) {
	const list = professors;
	return { list };
}

export default function Home({ loaderData }: Route.ComponentProps) {
	return <Index professorList={loaderData.list} />;
}
