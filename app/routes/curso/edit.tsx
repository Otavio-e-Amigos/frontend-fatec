import type { Route } from "./+types/edit";
import CursoService from "~/modules/curso/curso.service";
import User from "~/modules/user/user.class";
import Page from "~/pages/curso/edit";
export async function clientLoader({ params }: Route.LoaderArgs) {
  return {
    curso: await CursoService.get(
      Number(params.id),
      new User(JSON.parse(localStorage.getItem("auth") ?? "{}")),
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
