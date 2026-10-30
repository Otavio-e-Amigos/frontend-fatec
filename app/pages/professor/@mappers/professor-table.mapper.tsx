import { Link, useRevalidator } from "react-router";
import useWindow from "~/components/windows/useWindow";
import type Professor from "~/modules/professor/professor.class";
import deactivateWindow from "../@windows/deactivate.window";
import ProfessorService from "~/modules/professor/professor.service";
import AuthService from "~/modules/user/auth.service";
import useDialogs from "~/hooks/useDialogs";
import getErrorMessage from "~/classes/errors/get-error-message";
import ResourceDisplay from "~/layouts/tables/ResourceDisplay";
import type { WindowAPIConstructor } from "~/components/windows/window.types";

function RowActions({ prof }: { prof: Professor }) {
	const window = useWindow(deactivateWindow);
	const confirmationWindow: WindowAPIConstructor = {
		...deactivateWindow.initialData,
		description: `O professor ${prof.name ?? ""} não ficará disponível enquanto estiver desativado.`,
		tone: "danger",
		extras: {
			onConfirm: async () => {
				console.log("click!!");
				const res = await ProfessorService.deactivate(prof.id!, auth);
				if (res) {
					dialogs.toast.success(`${prof.name} foi desativado.`);
					revalidate();
					window.hide();
				}
				if (!res) {
					throw new Error(
						"Não foi possível desativar o professor. Tente novamente.",
					);
				}
			},
		},
	};

	const auth = AuthService.getUserToken();
	const { revalidate } = useRevalidator();
	const dialogs = useDialogs();

	function deactivate() {
		window.show(confirmationWindow);
	}

	async function activate() {
		try {
			const res = await ProfessorService.activate(prof.id!, auth);
			if (!res) throw new Error();
			dialogs.toast.success(`${prof.name} foi ativado.`);
			revalidate();
		} catch (error) {
			dialogs.toast.error(
				getErrorMessage(error, "Não foi possível ativar o professor."),
			);
		}
	}

	return (
		<div key={prof.id} className="row-actions">
			<Link
				className="btn"
				data-variant="icon"
				data-icon="edit"
				title="Editar"
				to={`/professor/${prof.id}/edit`}
			>
				Editar
			</Link>
			<button
				type="button"
				className="btn"
				data-variant="icon"
				data-icon="power"
				title={prof.status === "ATIVO" ? "Desativar" : "Ativar"}
				onClick={() =>
					prof.status === "ATIVO" ? void deactivate() : void activate()
				}
			>
				{prof.status === "ATIVO" ? "Desativar" : "Ativar"}
			</button>
		</div>
	);
}

export default function mapper(
	prof: Professor,
	// deactivate: any,
	// activate: any,
) {
	return [
		{
			value: prof.name,
			display: (
				<ResourceDisplay
					id={prof.id ?? ""}
					name={prof.name ?? ""}
					baseURL={"/professor"}
				/>
			),
		},
		prof.registry,
		prof.contract,
		prof.status,
		{
			value: 0,
			display: <RowActions prof={prof} />,
		},
	];
}
