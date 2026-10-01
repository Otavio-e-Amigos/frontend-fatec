import Page from "~/pages/system/user/add";
import UserService from "~/modules/user/user.service";
import { auth } from "~/mock/db/users.db";
import type { Route } from "../+types/edit";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Appointer: Editar Usuário" },
    // { name: "description", content: "Projeto PI 3º Semestre." },
  ];
}

export async function clientLoader({ params }: Route.LoaderArgs) {
	const id = Number(params.id);
	const user = await UserService.get(id, auth)
	return { user };
}

export default function Edit({ loaderData }: Route.ComponentProps) {
	// return <Page />
	if (!loaderData.user) {
		return <p>Insert not found page here</p>
	}
	return <Page user={loaderData.user}/>
}
