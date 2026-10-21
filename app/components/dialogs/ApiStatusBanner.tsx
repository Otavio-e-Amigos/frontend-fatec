import { useNavigate } from "react-router";
import useApiStatus from "~/hooks/useApiStatus";

export default function ApiStatusBanner() {
	const online = useApiStatus();
	const navigate = useNavigate();

	if (online) return null;

	return (
		<div
			role="alert"
			className="fixed inset-x-0 top-0 z-[70] flex flex-wrap items-center justify-center gap-3 bg-amber-100 px-4 py-2 text-sm text-amber-950 shadow"
		>
			<span>
				O servidor não está respondendo. Algumas ações podem não funcionar.
			</span>
			<button
				type="button"
				className="btn"
				data-variant="outline"
				data-size="sm"
				onClick={() => navigate(0)}
			>
				Tentar novamente
			</button>
		</div>
	);
}