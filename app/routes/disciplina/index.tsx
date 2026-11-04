import type { Route } from "./+types/index";
import DisciplinaService from "~/modules/disciplina/disciplina.service";
import AuthService from "~/modules/user/auth.service";
import Page from "~/pages/disciplina/index";

export function meta() {
  return [{ title: "Appointer: Disciplinas" }];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);

  const auth = AuthService.getUserToken();
  return {
    disciplinas: await DisciplinaService.get(auth),
    initial: {
      addResourceWindow: Boolean(url.searchParams.get("add")) ?? false,
    },
  };
}

export default function DisciplinaIndexRoute({
  loaderData,
}: Route.ComponentProps) {
  return <Page list={loaderData.disciplinas} initial={loaderData.initial} />;
}
