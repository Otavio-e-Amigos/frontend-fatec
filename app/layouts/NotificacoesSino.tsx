import { useCallback, useEffect, useRef, useState } from "react";
import NotificacaoService from "~/modules/notificacao/notificacao.service";
import type { Notificacao } from "~/modules/notificacao/notificacao.types";
import AuthService from "~/modules/user/auth.service";

/** Evento de janela: quem alterar notificações dispara para o sino atualizar na hora. */
export const NOTIFICACOES_ATUALIZAR = "notificacoes:atualizar";

const POLL_MS = 60_000; // o Back não avisa sozinho: o número é consultado de tempos em tempos
const LIST_SIZE = 10;

type Filtro = "todas" | "nao-lidas";

/** Nome curto da categoria, mostrado discretamente na linha de baixo. */
const CATEGORIAS: Record<string, string> = {
	EXTRACAO_GRADE: "Importação de grade",
	FOLHA_PONTO: "Folha de ponto",
	RELATORIO: "Relatório",
	CALENDARIO: "Calendário",
};

/** Pontinho de destaque só para o que merece atenção: falha (vermelho) ou aviso/pendência (amarelo). */
function destaque(item: Notificacao) {
	if (item.tipo.endsWith("_FALHA")) return "bg-hint-alert-dot";
	if (item.tipo.endsWith("_COM_AVISOS") || item.pendente) return "bg-hint-warning-dot";
	return null;
}

const pad = (value: number) => String(value).padStart(2, "0");

/** "agora", "há 5 min", "há 3 h", "ontem 14:30" ou "16/11 14:30". */
function quando(value: string) {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "";

	const now = new Date();
	const minutes = Math.floor((now.getTime() - date.getTime()) / 60_000);
	if (minutes < 1) return "agora";
	if (minutes < 60) return `há ${minutes} min`;
	if (minutes < 60 * 24 && now.getDate() === date.getDate()) {
		return `há ${Math.floor(minutes / 60)} h`;
	}

	const hora = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
	const yesterday = new Date(now);
	yesterday.setDate(now.getDate() - 1);
	if (yesterday.toDateString() === date.toDateString()) return `ontem ${hora}`;

	return `${pad(date.getDate())}/${pad(date.getMonth() + 1)} ${hora}`;
}

function Skeleton() {
	return (
		<div className="flex animate-pulse flex-col gap-2 px-6 py-3" aria-hidden>
			<div className="h-3 w-1/2 rounded bg-surface-sunken" />
			<div className="h-3 w-4/5 rounded bg-surface-sunken" />
		</div>
	);
}

/**
 * Sino de notificações do Header. É um painel preso ao botão (e não a janela do
 * gerenciador), para não competir com as janelas das telas, que só comportam uma.
 */
export default function NotificacoesSino() {
	const [open, setOpen] = useState(false);
	const [count, setCount] = useState(0);
	const [items, setItems] = useState<Notificacao[]>([]);
	const [filtro, setFiltro] = useState<Filtro>("todas");
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

	// número do sininho: busca ao montar, a cada minuto e quando outra tela pedir
	// (ex.: confirmar o calendário encerra uma pendência)
	useEffect(() => {
		refreshCount();
		const timer = setInterval(refreshCount, POLL_MS);
		window.addEventListener(NOTIFICACOES_ATUALIZAR, refreshCount);
		return () => {
			clearInterval(timer);
			window.removeEventListener(NOTIFICACOES_ATUALIZAR, refreshCount);
		};
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

	const visible = filtro === "nao-lidas" ? items.filter((item) => !item.lida) : items;

	return (
		<div ref={root} className="relative">
			<button
				type="button"
				className={`relative inline-flex size-9 items-center justify-center rounded-full text-lg transition-colors hover:bg-brand-soft ${
					open ? "bg-brand-soft" : ""
				}`}
				aria-label={count > 0 ? `Notificações: ${count} não lida(s)` : "Notificações"}
				aria-expanded={open}
				title="Notificações"
				onClick={() => setOpen((value) => !value)}
			>
				<span aria-hidden>🔔</span>
				{count > 0 && (
					<span className="absolute -right-0.5 -top-0.5 min-w-4.5 rounded-full bg-brand px-1 text-center text-[10px] font-semibold leading-4.5 text-white ring-2 ring-white">
						{count > 99 ? "99+" : count}
					</span>
				)}
			</button>

			{open && (
				<div
					role="dialog"
					aria-label="Últimas notificações"
					className="absolute right-0 top-full z-20 mt-2 flex max-h-[28rem] w-[22rem] max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-xl border border-line/60 bg-white shadow-lg shadow-black/5"
				>
					{/* Cabeçalho */}
					<div className="flex items-baseline justify-between gap-2 px-5 pb-1 pt-4">
						<h2 className="text-sm font-semibold text-ink">
							Notificações
							{count > 0 && (
								<span className="ml-2 text-xs font-normal text-ink-muted">
									{count} {count === 1 ? "nova" : "novas"}
								</span>
							)}
						</h2>
						<button
							type="button"
							className="text-xs text-ink-muted transition-colors hover:text-brand disabled:cursor-default disabled:opacity-40 disabled:hover:text-ink-muted"
							disabled={count === 0}
							onClick={readAll}
						>
							Marcar todas como lidas
						</button>
					</div>

					{/* Abas */}
					<div className="flex gap-1 px-4 pb-2 pt-1" role="tablist">
						{(
							[
								["todas", "Todas"],
								["nao-lidas", "Não lidas"],
							] as const
						).map(([value, label]) => (
							<button
								key={value}
								type="button"
								role="tab"
								aria-selected={filtro === value}
								className={`rounded-md px-2.5 py-1 text-xs transition-colors ${
									filtro === value
										? "bg-surface-sunken font-medium text-ink"
										: "text-ink-muted hover:text-ink"
								}`}
								onClick={() => setFiltro(value)}
							>
								{label}
							</button>
						))}
					</div>

					{/* Lista */}
					<div className="overflow-y-auto pb-2">
						{loading && items.length === 0 && (
							<>
								<Skeleton />
								<Skeleton />
								<Skeleton />
							</>
						)}

						{error && (
							<p className="px-5 py-3 text-xs text-danger-fg" role="alert">
								{error}
							</p>
						)}

						{!loading && !error && visible.length === 0 && (
							<div className="px-5 py-10 text-center">
								<p className="text-sm text-ink">Tudo em dia</p>
								<p className="mt-1 text-xs text-ink-muted">
									{filtro === "nao-lidas"
										? "Você não tem notificações não lidas."
										: "Os avisos do sistema aparecerão aqui."}
								</p>
							</div>
						)}

						<ul className="px-2">
							{visible.map((item) => {
								const dot = destaque(item);
								return (
									// separador fino e recuado: não encosta nas bordas do painel
									<li key={item.id} className="mx-3 border-b border-slate-700/30 last:border-b-0">
										<button
											type="button"
											className="-mx-3 my-1 flex w-[calc(100%+1.5rem)] gap-2.5 rounded-lg px-3 py-2 text-left transition-colors hover:bg-surface-sunken/70"
											onClick={() => read(item)}
										>
											{/* coluna do indicador: ponto só enquanto não lida */}
											<span aria-hidden className="flex w-2 shrink-0 justify-center pt-1.5">
												{!item.lida && <span className="size-1.5 rounded-full bg-brand" />}
											</span>

											<span className="flex min-w-0 flex-1 flex-col gap-0.5">
												<span
													className={`text-sm leading-snug text-ink ${
														item.lida ? "font-normal" : "font-medium"
													}`}
												>
													{item.titulo}
												</span>

												<span className="line-clamp-2 text-xs text-ink-muted">
													{item.mensagem}
												</span>

												<span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-ink-muted/80">
													{dot && <span aria-hidden className={`size-1.5 rounded-full ${dot}`} />}
													{CATEGORIAS[item.categoria] ?? "Sistema"} · {quando(item.criadaEm)}
													{item.pendente && !item.resolvidaEm && (
														<span className="text-hint-warning-fg">· Pendente</span>
													)}
												</span>
											</span>
										</button>
									</li>
								);
							})}
						</ul>
					</div>
				</div>
			)}
		</div>
	);
}
