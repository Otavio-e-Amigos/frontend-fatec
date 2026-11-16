import { useContext } from "react";
import { WindowContext } from "~/components/windows/window.contexts";
import ShadowCenter from "~/layouts/containers/ShadowCenter";
import type {
	RelatorioExtracaoGrade,
	RelatorioFolhaPonto,
	TipoRelatorio,
} from "~/modules/relatorio/relatorio.types";
import useRelatorio, { type RelatorioInitial } from "../@hooks/useRelatorio";
import RelatorioExtracaoGradeView from "./RelatorioExtracaoGrade";
import RelatorioFiltros from "./RelatorioFiltros";
import RelatorioFolhaPontoView from "./RelatorioFolhaPonto";

const TITULOS: Record<TipoRelatorio, { titulo: string; descricao: string }> = {
	EXTRACAO_GRADE: {
		titulo: "Relatório de extração de grades",
		descricao: "Importações de grade feitas a partir de PDF, com totais por período.",
	},
	FOLHA_PONTO: {
		titulo: "Relatório de folhas de ponto",
		descricao: "Folhas geradas no período, por professor, competência e usuário.",
	},
};

/**
 * Janela do relatório. Abra com:
 *   window.show({ dismissible: true }, <RelatorioJanela tipo="FOLHA_PONTO" initial={...} />)
 * O conteúdo (filtros + resultado) não depende da janela: dá para renderizá-lo
 * numa página inteira depois, sem reescrever.
 */
export default function RelatorioJanela({
	tipo,
	initial,
}: {
	tipo: TipoRelatorio;
	initial?: RelatorioInitial;
}) {
	const window = useContext(WindowContext);
	const state = useRelatorio(tipo, initial);
	const { titulo, descricao } = TITULOS[tipo];
	const periodo = state.resultado?.periodo;

	return (
		<ShadowCenter onClick={() => window.dismissible && window.hide()}>
			<section
				role="dialog"
				className="floor flex max-h-[90vh] w-full max-w-5xl flex-col rounded-card shadow-card"
				onClick={(event) => event.stopPropagation()}
			>
				<header className="floor-accent flex items-start justify-between gap-3 rounded-b-none border-x-0 border-t-0 px-5 py-3">
					<div>
						<h2 className="text-lg font-semibold text-ink">{titulo}</h2>
						<p className="text-xs text-ink-muted">{descricao}</p>
					</div>
					<button
						type="button"
						className="btn"
						data-variant="outline"
						data-size="sm"
						onClick={() => window.hide()}
					>
						Fechar
					</button>
				</header>

				<div className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
					<RelatorioFiltros {...state.filtros} />

					{state.error && (
						<p className="text-sm text-danger-fg" role="alert">
							{state.error}
						</p>
					)}

					{state.loading && <p className="text-sm text-ink-muted">Gerando relatório...</p>}

					{periodo && (
						<p className="text-sm font-medium text-ink">
							{periodo.descricao}
							{periodo.emAndamento && (
								<span className="ml-2 text-xs font-normal text-ink-muted">
									(período em andamento: dados parciais)
								</span>
							)}
						</p>
					)}

					{state.resultado && tipo === "EXTRACAO_GRADE" && (
						<RelatorioExtracaoGradeView data={state.resultado as RelatorioExtracaoGrade} />
					)}
					{state.resultado && tipo === "FOLHA_PONTO" && (
						<RelatorioFolhaPontoView data={state.resultado as RelatorioFolhaPonto} />
					)}

					{!state.resultado && !state.loading && !state.error && (
						<p className="text-sm text-ink-muted">Escolha os filtros e gere o relatório.</p>
					)}
				</div>

				<footer className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-5 py-3">
					<p className="text-[11px] text-ink-muted">
						Só há dados a partir da atualização do sistema que passou a registrar extrações e folhas.
					</p>
					<div className="flex gap-2">
						{(["PDF", "DOCX"] as const).map((formato) => (
							<button
								key={formato}
								type="button"
								className="btn"
								data-variant="outline"
								data-size="sm"
								disabled={!state.resultado || state.exporting !== null}
								onClick={() => state.onExportar(formato)}
							>
								{state.exporting === formato ? "Exportando..." : `Exportar ${formato}`}
							</button>
						))}
					</div>
				</footer>
			</section>
		</ShadowCenter>
	);
}
