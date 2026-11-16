import ChartCard from "~/components/charts/ChartCard";
import { PizzaSimples } from "~/components/charts/Charts";
import formatDate from "~/modules/periodo-letivo/format-date";
import type { RelatorioExtracaoGrade } from "~/modules/relatorio/relatorio.types";
import {
	STATUS_EXTRACAO,
	formatDateTime,
	formatDuration,
	formatNumber,
} from "../relatorio-page.utils";
import { Indicador, Indicadores, RelatorioTabela, Secao, soma } from "./RelatorioComum";

const LIMITE_DETALHE = 50;

// verde = sucesso, amarelo = avisos, vermelho = falha (cores já usadas nos avisos do tema)
const STATUS_COLORS = [
	"var(--color-hint-success-dot)",
	"var(--color-hint-warning-dot)",
	"var(--color-brand)",
];

/** Resultado do relatório de extração de grades: resumo, listas e totalizações. */
export default function RelatorioExtracaoGradeView({
	data,
}: {
	data: RelatorioExtracaoGrade;
}) {
	const { resumo } = data;
	const diasComMovimento = data.evolucaoDiaria.filter((dia) => dia.total > 0);
	const detalhe = data.extracoes.slice(0, LIMITE_DETALHE);

	return (
		<div className="flex flex-col gap-5">
			<Indicadores>
				<Indicador label="Extrações (tentativas)" value={formatNumber(resumo.totalExtracoes)} />
				<Indicador
					label="Grades extraídas"
					value={formatNumber(resumo.gradesExtraidas)}
					hint={`${formatNumber(resumo.sucessoComAvisos)} com avisos`}
				/>
				<Indicador label="Falhas" value={formatNumber(resumo.falhas)} />
				<Indicador
					label="Taxa de sucesso"
					value={`${formatNumber(resumo.taxaSucessoPercentual, 1)}%`}
				/>
				<Indicador label="Disciplinas extraídas" value={formatNumber(resumo.totalDisciplinas)} />
				<Indicador label="Aulas extraídas" value={formatNumber(resumo.totalAulas)} />
				<Indicador
					label="Disciplinas por grade"
					value={formatNumber(resumo.mediaDisciplinasPorGrade, 1)}
				/>
				<Indicador
					label="Tempo médio"
					value={formatDuration(resumo.tempoMedioMs)}
					hint={`máximo ${formatDuration(resumo.tempoMaximoMs)}`}
				/>
			</Indicadores>

			<ChartCard
				title="Resultado das extrações"
				description="Proporção de extrações com sucesso, com avisos e com falha."
				empty={resumo.totalExtracoes === 0}
			>
				<PizzaSimples
					colors={STATUS_COLORS}
					data={[
						{ name: "Sucesso", value: resumo.sucessoSemAvisos },
						{ name: "Com avisos", value: resumo.sucessoComAvisos },
						{ name: "Falhas", value: resumo.falhas },
					]}
				/>
			</ChartCard>

			<Secao titulo="Por usuário">
				<RelatorioTabela
					colunas={["Usuário", "Total", "Sucesso", "Falhas"]}
					linhas={data.porUsuario.map((u) => [u.usuario, u.total, u.sucesso, u.falhas])}
					totais={[
						"Total",
						soma(data.porUsuario.map((u) => u.total)),
						soma(data.porUsuario.map((u) => u.sucesso)),
						soma(data.porUsuario.map((u) => u.falhas)),
					]}
				/>
			</Secao>

			<Secao titulo="Por período letivo">
				<RelatorioTabela
					colunas={["Período letivo", "Grades"]}
					linhas={data.porPeriodoLetivo.map((p) => [`${p.semestre}º/${p.ano}`, p.quantidade])}
					totais={["Total", soma(data.porPeriodoLetivo.map((p) => p.quantidade))]}
				/>
			</Secao>

			<Secao titulo="Principais falhas">
				<RelatorioTabela
					colunas={["Motivo", "Ocorrências"]}
					linhas={data.principaisFalhas.map((f) => [f.motivo, f.quantidade])}
					totais={["Total", soma(data.principaisFalhas.map((f) => f.quantidade))]}
					vazio="Nenhuma falha no período."
				/>
			</Secao>

			<Secao titulo="Evolução por dia">
				<RelatorioTabela
					colunas={["Dia", "Total", "Sucesso", "Falhas"]}
					linhas={diasComMovimento.map((d) => [formatDate(d.data), d.total, d.sucesso, d.falhas])}
					totais={[
						"Total",
						soma(diasComMovimento.map((d) => d.total)),
						soma(diasComMovimento.map((d) => d.sucesso)),
						soma(diasComMovimento.map((d) => d.falhas)),
					]}
					nota="Só os dias com extrações aparecem."
				/>
			</Secao>

			<Secao titulo="Extrações do período">
				<RelatorioTabela
					colunas={["Data/hora", "Usuário", "Arquivo", "Status", "Professor", "Disciplinas", "Aulas"]}
					linhas={detalhe.map((e) => [
						formatDateTime(e.dataHora),
						e.usuario ?? "—",
						e.arquivo ?? "—",
						STATUS_EXTRACAO[e.status] ?? e.status,
						e.professor ?? "—",
						e.disciplinas,
						e.aulas,
					])}
					totais={[
						`Total: ${data.extracoes.length} extração(ões)`,
						"",
						"",
						"",
						"",
						soma(data.extracoes.map((e) => e.disciplinas)),
						soma(data.extracoes.map((e) => e.aulas)),
					]}
					nota={
						data.extracoes.length > LIMITE_DETALHE
							? `Mostrando as primeiras ${LIMITE_DETALHE} de ${data.extracoes.length}. A lista completa está no PDF/DOCX.`
							: undefined
					}
				/>
			</Secao>
		</div>
	);
}
