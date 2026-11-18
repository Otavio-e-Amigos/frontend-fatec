import { useEffect, useState } from "react";
import getErrorMessage from "~/classes/errors/get-error-message";
import useToast from "~/components/toasts/useToast";
import { NOTIFICACOES_ATUALIZAR } from "~/layouts/NotificacoesSino";
import type { StatusAtualizacao } from "~/modules/calendario/calendario.atualizacao";
import CalendarioService from "~/modules/calendario/calendario.service";
import AuthService from "~/modules/user/auth.service";
import { formatDateTime } from "~/pages/relatorio/relatorio-page.utils";

/**
 * Confirmação anual do calendário: mostra se o ano exibido já foi revisado e deixa
 * confirmar (ou reconfirmar). Confirmar encerra os lembretes de fevereiro do ano.
 */
export default function CalendarioConfirmacaoAnual({
	year,
	eventsCount,
}: {
	year: number;
	/** Muda quando o usuário cria ou remove eventos: o total do ano é buscado de novo. */
	eventsCount: number;
}) {
	const toast = useToast();
	const [status, setStatus] = useState<StatusAtualizacao | null>(null);
	const [observacao, setObservacao] = useState("");
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		let ignore = false;
		setStatus(null);
		setError("");

		CalendarioService.statusAtualizacao(year, AuthService.getUserToken())
			.then((data) => !ignore && setStatus(data))
			// o Back só aceita de 2000 a 2050 e até o próximo ano: a mensagem dele explica
			.catch(
				(e) =>
					!ignore &&
					setError(getErrorMessage(e, "Não foi possível consultar a confirmação do ano.")),
			);

		return () => {
			ignore = true;
		};
	}, [year, eventsCount]);

	async function confirm() {
		setBusy(true);
		setError("");
		try {
			setStatus(
				await CalendarioService.confirmarAtualizacao(
					year,
					observacao,
					AuthService.getUserToken(),
				),
			);
			setObservacao("");
			toast.push({ tone: "success", message: `Calendário de ${year} confirmado.` });
			// a pendência de lembrete foi encerrada: o sino atualiza o número agora
			window.dispatchEvent(new Event(NOTIFICACOES_ATUALIZAR));
		} catch (e) {
			setError(getErrorMessage(e, "Não foi possível confirmar o calendário."));
		} finally {
			setBusy(false);
		}
	}

	return (
		<div className="flex flex-col gap-2 rounded-control border border-line p-3">
			<div className="flex flex-wrap items-start justify-between gap-2">
				<div className="text-xs">
					<p className="font-semibold text-ink">
						{status?.atualizado
							? `✔ Calendário de ${year} confirmado`
							: `Calendário de ${year} ainda não confirmado`}
					</p>

					{status?.atualizado && (
						<p className="text-ink-muted">
							Em {formatDateTime(status.atualizadoEm)}
							{status.atualizadoPor ? ` por ${status.atualizadoPor}` : ""}.
							{status.observacao ? ` Observação: ${status.observacao}` : ""}
						</p>
					)}

					{status && (
						<p className="text-ink-muted">
							{status.eventosCadastradosNoAno} evento(s) cadastrado(s) em {year}.
						</p>
					)}

					{status?.lembreteAtivo && (
						<p className="font-medium text-hint-warning-fg">
							Lembrete de fevereiro ativo: revise os eventos e confirme.
						</p>
					)}
				</div>

				{status && (
					<div className="flex flex-wrap items-center gap-2">
						<input
							className="form-input w-56"
							placeholder="Observação (opcional)"
							maxLength={500}
							value={observacao}
							onChange={(event) => setObservacao(event.currentTarget.value)}
						/>
						<button
							type="button"
							className="btn"
							data-size="sm"
							disabled={busy}
							onClick={confirm}
						>
							{busy
								? "Confirmando..."
								: status.atualizado
									? `Reconfirmar ${year}`
									: `Confirmar atualização de ${year}`}
						</button>
					</div>
				)}
			</div>

			{error && (
				<p className="text-xs text-danger-fg" role="alert">
					{error}
				</p>
			)}
		</div>
	);
}
