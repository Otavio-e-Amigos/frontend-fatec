import { redirect } from "react-router";
import type { Route } from "./+types/home";
import Index from "~/pages";
import AuthService from "~/modules/user/auth.service";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Appointer" },
		{ name: "description", content: "Projeto PI 3º Semestre." },
	];
}

export async function clientLoader({}: Route.LoaderArgs) {
	if (!AuthService.hasUserToken()) {
		throw redirect("/login");
	}
	const { name, profile } = AuthService.getUserToken();
	return { name, profile };
}

export default function Home({ loaderData }: Route.ComponentProps) {
	return <Index name={loaderData.name} profile={loaderData.profile} />;
}