import type { Route } from "./+types/index";
import Service from "~/modules/periodo-letivo/periodo-letivo.service";
import AuthService from "~/modules/user/auth.service";
import Page from "~/pages/periodo-letivo/index";

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);

  return {
    periodos: await Service.get(AuthService.getUserToken()),
    initial: {
      addResourceWindow: Boolean(url.searchParams.get("add")) ?? false,
    },
  };
}
export default function PeriodoIndexRoute({
  loaderData,
}: Route.ComponentProps) {
  return <Page list={loaderData.periodos} initial={loaderData.initial} />;
}
