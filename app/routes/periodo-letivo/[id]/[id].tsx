import type { Route } from "./+types/[id]";
import PeriodoLetivoService from "~/modules/periodo-letivo/periodo-letivo.service";
import User from "~/modules/user/user.class";
import Page from "~/pages/periodo-letivo/[id]";

export async function clientLoader({ params }: Route.LoaderArgs) {
  const auth = new User(JSON.parse(localStorage.getItem("auth") ?? "{}"));
  return { periodo: await PeriodoLetivoService.get(Number(params.id), auth) };
}

export default function PeriodoLetivoDetailsRoute({ loaderData }: Route.ComponentProps) {
  return loaderData.periodo ? (
    <Page periodo={loaderData.periodo} />
  ) : (
    <p className="m-5">Período letivo não encontrado.</p>
  );
}
