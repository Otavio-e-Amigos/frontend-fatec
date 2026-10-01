import Page from "~/pages/system";
import type { Route } from "./+types/index";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Appointer: Painel do Gestor" },
		// { name: "description", content: "Projeto PI 3º Semestre." },
	];
}

export async function clientLoader({}: Route.LoaderArgs) {
	// const list = professors;
	// return { list };
}

export default function Home({ loaderData }: Route.ComponentProps) {
	return <Page />;
}
