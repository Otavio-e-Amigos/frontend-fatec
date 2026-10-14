import type { Route } from "./+types/index";
import CursoService from "~/modules/curso/curso.service";
import AuthService from "~/modules/user/auth.service";
import Page from "~/pages/curso/index";
export async function clientLoader() {
  return {
    cursos: await CursoService.get(
      AuthService.getUserToken(),
    ),
  };
}
export default function CursoIndexRoute({ loaderData }: Route.ComponentProps) {
  return <Page list={loaderData.cursos} />;
}
