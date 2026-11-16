import { redirect } from "react-router";
import type { Route } from "./+types/index";
import CalendarioService from "~/modules/calendario/calendario.service";
import AuthService from "~/modules/user/auth.service";
import Page from "~/pages/calendario/index";

export function meta() {
	return [{ title: "Appointer: Calendário Acadêmico" }];
}

export async function clientLoader() {
	if (!AuthService.hasUserToken()) throw redirect("/login");

	return { eventos: await CalendarioService.get(AuthService.getUserToken()) };
}

export default function CalendarioIndexRoute({ loaderData }: Route.ComponentProps) {
	return <Page list={loaderData.eventos} />;
}
