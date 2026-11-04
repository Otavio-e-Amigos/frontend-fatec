import { useLocation } from "react-router";
import useApiStatus from "~/hooks/useApiStatus";
import { APP_INFO } from "~/config/app-info";
import { useTheme } from "~/components/themes/ThemeProvider";

export default function Footer() {
	const online = useApiStatus();
	const { pathname } = useLocation();
	const theme = useTheme();

	// A tela de login fica sem rodapé.
	if (pathname === "/login") return null;

	function ThemeWidget() {
		return (
			<div className="flex flex-wrap gap-2 items-center">
				<p className="text-xs">Tema:</p>
				<select
					onChange={(e) => {
						console.log("changing theme!", e.currentTarget.value);
						theme.setTheme(e.currentTarget.value);
					}}
					className="h-fit bg-page-floor rounded-lg text-text"
					defaultValue={theme.theme}
				>
					{theme.THEMES.map((c) => {
						return c.themes.map((t, idx) => {
							// console.log();
							return (
								<option
									key={idx}
									selected={localStorage.getItem("app-theme") === t.value}
									value={t.value}
								>
									{t.label}
								</option>
							);
						});
					})}
				</select>
			</div>
		);
	}

	return (
		<footer className="mt-auto w-full bg-brand-shade text-white">
			<div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-3 py-2 text-xs">
				<div className="flex flex-wrap gap-2">
					<ThemeWidget/>
					<p className="text-white/90">
						<span className="font-semibold text-white">{APP_INFO.name}</span>
						{" · "}
						{APP_INFO.institution}
						{" · "}v{APP_INFO.version}
						{import.meta.env.DEV && (
							<span className="text-white/60"> · desenvolvimento</span>
						)}
					</p>
				</div>

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
