import type { Route } from "./+types/index";
import Service from "~/modules/periodo-letivo/periodo-letivo.service";
import User from "~/modules/user/user.class";
import Page from "~/pages/periodo-letivo/index";
export async function clientLoader() {
  return {
    periodos: await Service.get(
      new User(JSON.parse(localStorage.getItem("auth") ?? "{}")),
    ),
  };
}
export default function PeriodoIndexRoute({
  loaderData,
}: Route.ComponentProps) {
  return <Page list={loaderData.periodos} />;
}
