import Page from "~/pages/system/user/add";
import type { Route } from "../+types";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Appointer: Adicionar Usuário do sistema" },
		// { name: "description", content: "Projeto PI 3º Semestre." },
	];
}

export default function AddUser() {
	return <Page />;
}
