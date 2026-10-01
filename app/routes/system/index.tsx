import Page from "~/pages/system";
import type { Route } from "./+types/index";
import { DefaultAPIModule } from "~/modules/api/modules/default/DefaultAPIModule";
import UserService from "~/modules/user/user.service";
import User from "~/modules/user/user.class";
// import { auth } from "~/mock/db/users.db";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Appointer: Painel do Gestor" },
		// { name: "description", content: "Projeto PI 3º Semestre." },
	];
}

export async function clientLoader({}: Route.LoaderArgs) {
	const module = new DefaultAPIModule()
	const auth = new User(JSON.parse(localStorage.getItem("auth") as string))
	const users = await UserService.get(auth);
	return { users };
}

export default function Home({ loaderData }: Route.ComponentProps) {
	return <Page users={loaderData.users} />;
}
