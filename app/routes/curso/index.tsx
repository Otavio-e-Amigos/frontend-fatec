import type { Route } from "./+types/index";
import CursoService from "~/modules/curso/curso.service";
import User from "~/modules/user/user.class";
import Page from "~/pages/curso/index";
export async function clientLoader() {
  return {
    cursos: await CursoService.get(
      new User(JSON.parse(localStorage.getItem("auth") ?? "{}")),
    ),
  };
}
export default function CursoIndexRoute({ loaderData }: Route.ComponentProps) {
  return <Page list={loaderData.cursos} />;
}
