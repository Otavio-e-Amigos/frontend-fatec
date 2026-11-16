import Page from "~/pages/system";
import type { Route } from "./+types/index";
import UserService from "~/modules/user/user.service";
import AuthService from "~/modules/user/auth.service";
import EstatisticasService from "~/modules/estatisticas/estatisticas.service";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Appointer: Painel do Gestor" },
	];
}

export async function clientLoader({}: Route.LoaderArgs) {
	const auth = AuthService.getUserToken();
	const [users, cadastros] = await Promise.all([
		UserService.get(auth),
		EstatisticasService.cadastros(auth),
	]);
	return { users, cadastros };
}

export default function Home({ loaderData }: Route.ComponentProps) {
	return <Page users={loaderData.users} cadastros={loaderData.cadastros} />;
}
