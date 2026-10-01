import Page from "~/pages/system/user/add";
import type { Route } from "../+types";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Appointer: Adicionar Usuário do sistema" },
		// { name: "description", content: "Projeto PI 3º Semestre." },
	];
}

export async function clientLoader({}: Route.LoaderArgs) {
	// const list = professors;
	// return { list };
}

export default function AddUser({ loaderData }: Route.ComponentProps) {
	return <Page />;
}
