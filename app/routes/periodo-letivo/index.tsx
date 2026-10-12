import type { Route } from "./+types/index";
import Service from "~/modules/periodo-letivo/periodo-letivo.service";
import AuthService from "~/modules/user/auth.service";
import Page from "~/pages/periodo-letivo/index";
export async function clientLoader() {
  return {
    periodos: await Service.get(
      AuthService.getUserToken(),
    ),
  };
}
export default function PeriodoIndexRoute({
  loaderData,
}: Route.ComponentProps) {
  return <Page list={loaderData.periodos} />;
}
