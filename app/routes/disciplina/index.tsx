import type { Route } from "./+types/index";
import DisciplinaService from "~/modules/disciplina/disciplina.service";
import User from "~/modules/user/user.class";
import Page from "~/pages/disciplina/index";

export function meta() {
  return [{ title: "Appointer: Disciplinas" }];
}

export async function clientLoader() {
  const auth = new User(JSON.parse(localStorage.getItem("auth") ?? "{}"));
  return { disciplinas: await DisciplinaService.get(auth) };
}

export default function DisciplinaIndexRoute({
  loaderData,
}: Route.ComponentProps) {
  return <Page list={loaderData.disciplinas} />;
}
