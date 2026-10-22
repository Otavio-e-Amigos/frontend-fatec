import { useLocation } from "react-router";
import useApiStatus from "~/hooks/useApiStatus";
import { APP_INFO } from "~/config/app-info";

export default function Footer() {
	const online = useApiStatus();
	const { pathname } = useLocation();

	// A tela de login fica sem rodapé.
	if (pathname === "/login") return null;

	return (
		<footer className="mt-auto w-full bg-brand-shade text-white">
			<div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-3 py-2 text-xs">
				<p className="text-white/90">
					<span className="font-semibold text-white">{APP_INFO.name}</span>
					{" · "}
					{APP_INFO.institution}
					{" · "}v{APP_INFO.version}
					{import.meta.env.DEV && (
						<span className="text-white/60"> · desenvolvimento</span>
					)}
				</p>

				<div className="flex items-center gap-3">
					<span
						className="badge"
						data-tone={online ? "ok" : "danger"}
						role="status"
					>
						{online ? "Servidor online" : "Sem conexão com o servidor"}
					</span>

					<a className="header-link" href={APP_INFO.supportHref}>
						{APP_INFO.supportLabel}
					</a>
				</div>
			</div>
		</footer>
	);
}