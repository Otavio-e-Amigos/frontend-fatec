import { useCallback, useEffect, useRef, useState } from "react";
import NotificacaoService from "~/modules/notificacao/notificacao.service";
import type { Notificacao } from "~/modules/notificacao/notificacao.types";
import AuthService from "~/modules/user/auth.service";

const POLL_MS = 60_000; // o Back não avisa sozinho: o número é consultado de tempos em tempos
const LIST_SIZE = 10;

/** 2026-11-16T14:30:00 -> 16/11 14:30 */
function quando(value: string) {
	const [date, time = ""] = value.split("T");
	const [, month, day] = date.split("-");
	return `${day}/${month} ${time.slice(0, 5)}`;
}

/**
 * Sino de notificações do Header. É um painel pequeno preso ao botão (e não a janela
 * do gerenciador), para não competir com as janelas das telas, que só comportam uma.
 */
export default function NotificacoesSino() {
	const [open, setOpen] = useState(false);
	const [count, setCount] = useState(0);
	const [items, setItems] = useState<Notificacao[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const root = useRef<HTMLDivElement>(null);

	const refreshCount = useCallback(async () => {
		try {
			const { naoLidas } = await NotificacaoService.contagem(AuthService.getUserToken());
			setCount(naoLidas);
		} catch {
			// API fora do ar ou sessão expirada: o restante do site já trata isso
		}
	}, []);

	async function loadList() {
		setLoading(true);
		setError("");
		try {
			setItems(await NotificacaoService.listar(AuthService.getUserToken(), LIST_SIZE));
		} catch {
			setError("Não foi possível carregar as notificações.");
		} finally {
			setLoading(false);
		}
	}

	// número do sininho: busca ao montar e a cada minuto
	useEffect(() => {
		refreshCount();
		const timer = setInterval(refreshCount, POLL_MS);
		return () => clearInterval(timer);
	}, [refreshCount]);

	// ao abrir: carrega a lista e fecha com clique fora ou Esc
	useEffect(() => {
		if (!open) return;
		loadList();
		refreshCount();

		const onClick = (event: MouseEvent) => {
			if (!root.current?.contains(event.target as Node)) setOpen(false);
		};
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") setOpen(false);
		};
		document.addEventListener("mousedown", onClick);
		document.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("mousedown", onClick);
			document.removeEventListener("keydown", onKey);
		};
	}, [open]);

	async function read(item: Notificacao) {
		if (item.lida) return;
		setItems((list) => list.map((n) => (n.id === item.id ? { ...n, lida: true } : n)));
		setCount((value) => Math.max(0, value - 1));
		try {
			await NotificacaoService.marcarLida(item.id, AuthService.getUserToken());
		} catch {
			loadList();
			refreshCount();
		}
	}

	async function readAll() {
		try {
			await NotificacaoService.marcarTodasLidas(AuthService.getUserToken());
			setItems((list) => list.map((n) => ({ ...n, lida: true })));
			setCount(0);
		} catch {
			setError("Não foi possível marcar como lidas.");
		}
	}

	return (
		<div ref={root} className="relative">
			<button
				type="button"
				className="relative inline-flex h-8 w-8 items-center justify-center rounded-control text-lg hover:bg-brand-soft"
				aria-label={count > 0 ? `Notificações: ${count} não lida(s)` : "Notificações"}
				aria-expanded={open}
				title="Notificações"
				onClick={() => setOpen((value) => !value)}
			>
				<span aria-hidden>🔔</span>
				{count > 0 && (
					<span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-brand px-1 text-center text-[10px] font-semibold leading-4 text-white">
						{count > 99 ? "99+" : count}
					</span>
				)}
			</button>

			{open && (
				<div
					role="dialog"
					aria-label="Últimas notificações"
					className="absolute right-0 top-full z-20 mt-2 flex max-h-96 w-80 flex-col rounded-card border border-line bg-white shadow-card"
				>
					<div className="flex items-center justify-between gap-2 border-b border-line px-3 py-2">
						<h2 className="text-sm font-semibold text-ink">Notificações</h2>
						<button
							type="button"
							className="text-xs text-brand hover:underline disabled:opacity-50"
							disabled={count === 0}
							onClick={readAll}
						>
							Marcar todas como lidas
						</button>
					</div>

					<div className="overflow-y-auto">
						{loading && items.length === 0 && (
							<p className="px-3 py-4 text-sm text-ink-muted">Carregando...</p>
						)}
						{error && <p className="px-3 py-2 text-xs text-danger-fg">{error}</p>}
						{!loading && !error && items.length === 0 && (
							<p className="px-3 py-6 text-center text-sm text-ink-muted">
								Nenhuma notificação.
							</p>
						)}

						<ul>
							{items.map((item) => (
								<li key={item.id} className="border-b border-line last:border-b-0">
									<button
										type="button"
										className={`flex w-full flex-col gap-0.5 px-3 py-2 text-left hover:bg-surface-sunken ${
											item.lida ? "" : "bg-brand-soft/60"
										}`}
										onClick={() => read(item)}
									>
										<span className="flex items-center justify-between gap-2">
											<span
												className={`text-sm text-ink ${item.lida ? "" : "font-semibold"}`}
											>
												{item.titulo}
											</span>
											{!item.lida && (
												<span aria-label="Não lida" className="size-2 shrink-0 rounded-full bg-brand" />
											)}
										</span>
										<span className="text-xs text-ink-muted">{item.mensagem}</span>
										<span className="flex items-center gap-2 text-[11px] text-ink-muted">
											{quando(item.criadaEm)}
											{item.pendente && !item.resolvidaEm && (
												<span className="rounded-full bg-hint-warning px-1.5 text-hint-warning-fg">
													Pendente
												</span>
											)}
										</span>
									</button>
								</li>
							))}
						</ul>
					</div>
				</div>
			)}
		</div>
	);
}
