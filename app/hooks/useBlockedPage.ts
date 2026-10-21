import { useEffect } from "react";
import { useNavigate } from "react-router";
import useDialogs from "./useDialogs";

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
	const dialogs = useDialogs();
	const navigate = useNavigate();

	useEffect(() => {
		if (!blocked) return;
		return dialogs.alert({
			title,
			description,
			actionLabel,
			dismissible: false,
			onAction: () => navigate(redirectTo),
		});
	}, [blocked]);

	return blocked;
}