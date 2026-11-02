import Page from "~/pages/system";
import type { Route } from "./+types/index";
import UserService from "~/modules/user/user.service";
import AuthService from "~/modules/user/auth.service";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Appointer: Painel do Gestor" },
	];
}

export async function clientLoader({}: Route.LoaderArgs) {
	const auth = AuthService.getUserToken();
	const users = await UserService.get(auth);
	return { users };
}

export default function Home({ loaderData }: Route.ComponentProps) {
	return <Page users={loaderData.users} />;
}
