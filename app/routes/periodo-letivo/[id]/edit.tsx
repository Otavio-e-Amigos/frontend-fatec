import type { Route } from "./+types/edit";
import AuthService from "~/modules/user/auth.service";
import PeriodoLetivoService from "~/modules/periodo-letivo/periodo-letivo.service";
import Page from "~/pages/periodo-letivo/add";

export async function clientLoader({ params }: Route.LoaderArgs) {
	return {
		periodo: await PeriodoLetivoService.get(
			Number(params.id),
			AuthService.getUserToken(),
		),
	};
}

export default function PeriodoLetivoEditRoute({
	loaderData,
}: Route.ComponentProps) {
	return loaderData.periodo ? (
		<Page periodo={loaderData.periodo} />
	) : (
		<p className="m-5">Período letivo não encontrado.</p>
	);
}
