import type { Route } from "./+types/index";
import DisciplinaService from "~/modules/disciplina/disciplina.service";
import AuthService from "~/modules/user/auth.service";
import Page from "~/pages/disciplina/index";

export function meta() {
  return [{ title: "Appointer: Disciplinas" }];
}

export async function clientLoader() {
  const auth = AuthService.getUserToken();
  return { disciplinas: await DisciplinaService.get(auth) };
}

export default function DisciplinaIndexRoute({
  loaderData,
}: Route.ComponentProps) {
  return <Page list={loaderData.disciplinas} />;
}
