import { useEffect } from "react";
import { useNavigate } from "react-router";
import useWindow from "~/components/windows/useWindow";
import BasicWindow from "~/layouts/windows/BasicWindow";
// import ConfirmationWindowAction from "~/layouts/windows/actions/Confirmation.window-action";

type BlockedPageOptions = {
	title?: string;
	description?: string;
	actionLabel?: string;
	redirectTo?: string;
};

/** Enquanto `blocked` for true, mostra um alerta que não pode ser fechado. */
export default function useBlockedPage(
	blocked: boolean,
	{
		title = "Acesso restrito",
		description = "Você não tem permissão para acessar esta página.",
		actionLabel = "Voltar ao início",
		redirectTo = "/",
	}: BlockedPageOptions = {},
) {
	const window = useWindow({
		wrapper: <BasicWindow/>,
		initialData: {
			title,
			description,
			actions: <ReturnButton/>
		}
	})
	const navigate = useNavigate();

	function ReturnButton() {
		return <button className="btn btn-normal" onClick={() => navigate(redirectTo)}>
			{actionLabel}
		</button>
	}
	useEffect(() => {
		if (!blocked) return;
		return window.show()

		// 	actionLabel,
		// 	dismissible: false,
		// 	onAction: () => navigate(redirectTo),
		// });
	}, [blocked]);

	return blocked;
}
