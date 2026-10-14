import type { Route } from "./+types/edit";
import CursoService from "~/modules/curso/curso.service";
import AuthService from "~/modules/user/auth.service";
import Page from "~/pages/curso/edit";
export async function clientLoader({ params }: Route.LoaderArgs) {
  return {
    curso: await CursoService.get(
      Number(params.id),
      AuthService.getUserToken(),
    ),
  };
}
export default function CursoEditRoute({ loaderData }: Route.ComponentProps) {
  return loaderData.curso ? (
    <Page curso={loaderData.curso} />
  ) : (
    <p>Curso não encontrado.</p>
  );
}
