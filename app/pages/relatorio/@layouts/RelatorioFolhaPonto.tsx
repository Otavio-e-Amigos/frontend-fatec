import ChartCard from "~/components/charts/ChartCard";
import { LinhaSimples } from "~/components/charts/Charts";
import formatDate from "~/modules/periodo-letivo/format-date";
import type { RelatorioFolhaPonto } from "~/modules/relatorio/relatorio.types";
import { formatDateTime, formatNumber } from "../relatorio-page.utils";
import { Indicador, Indicadores, RelatorioTabela, Secao, soma } from "./RelatorioComum";

const LIMITE_DETALHE = 50;

/** Resultado do relatório de folhas de ponto: geral (todos) ou individual (um professor). */
export default function RelatorioFolhaPontoView({ data }: { data: RelatorioFolhaPonto }) {
	const { resumo } = data;
	const individual = data.escopo === "INDIVIDUAL";
	const diasComMovimento = data.evolucaoDiaria.filter((dia) => dia.quantidade > 0);
	const detalhe = data.historico.slice(0, LIMITE_DETALHE);
	const professor = data.professor;

	return (
		<div className="flex flex-col gap-5">
			<Indicadores>
				<Indicador label="Folhas geradas" value={formatNumber(resumo.totalFolhas)} />
				<Indicador label="Professores atendidos" value={formatNumber(resumo.professoresAtendidos)} />
				<Indicador
					label="Folhas por professor"
					value={formatNumber(resumo.mediaFolhasPorProfessor, 1)}
				/>
				<Indicador label="Competências (mês/ano)" value={formatNumber(resumo.competenciasDistintas)} />
				{!individual && (
					<>
						<Indicador label="Professores ativos" value={formatNumber(resumo.professoresAtivos)} />
						<Indicador
							label="Ativos sem folha no período"
							value={formatNumber(resumo.professoresAtivosSemFolha)}
						/>
					</>
				)}
				<Indicador label="Gerações repetidas" value={formatNumber(resumo.regeracoes)} />
				<Indicador
					label="Grade de outro período"
					value={formatNumber(resumo.folhasComGradeDeOutroPeriodo)}
				/>
			</Indicadores>

			<ChartCard
				title="Folhas geradas por dia"
				description="Evolução das gerações dentro do período escolhido."
				empty={resumo.totalFolhas === 0}
			>
				<LinhaSimples
					label="Folhas"
					data={data.evolucaoDiaria.map((dia) => ({
						name: formatDate(dia.data).slice(0, 5),
						value: dia.quantidade,
					}))}
				/>
			</ChartCard>

			{individual && professor && (
				<>
					<Secao titulo="Professor">
						<div className="grid gap-2 rounded-control border border-line p-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
							<p><span className="text-ink-muted">Nome: </span>{professor.nome}</p>
							<p><span className="text-ink-muted">Matrícula: </span>{professor.matricula ?? "—"}</p>
							<p><span className="text-ink-muted">Código: </span>{professor.codigo ?? "—"}</p>
							<p><span className="text-ink-muted">Titulação: </span>{professor.titulacao ?? "—"}</p>
							<p><span className="text-ink-muted">Contrato: </span>{professor.regimeContrato ?? "—"}</p>
							<p><span className="text-ink-muted">Status: </span>{professor.status ?? "—"}</p>
							<p><span className="text-ink-muted">Folhas no histórico: </span>{professor.totalFolhasHistorico}</p>
							<p><span className="text-ink-muted">Primeira geração: </span>{formatDateTime(professor.primeiraGeracao)}</p>
							<p><span className="text-ink-muted">Última geração: </span>{formatDateTime(professor.ultimaGeracao)}</p>
							{professor.cursos.length > 0 && (
								<p className="sm:col-span-2 lg:col-span-3">
									<span className="text-ink-muted">Cursos: </span>{professor.cursos.join(", ")}
								</p>
							)}
						</div>
					</Secao>

					<Secao titulo="Grades do professor">
						<RelatorioTabela
							colunas={["Período letivo", "Disciplinas", "Aulas/semana", "Carga semanal", "Carga mensal", "Folhas geradas"]}
							linhas={professor.grades.map((g) => [
								g.periodoLetivo,
								g.disciplinas,
								g.aulasSemanais,
								formatNumber(g.cargaSemanal, 1),
								formatNumber(g.cargaMensal, 1),
								g.folhasGeradas,
							])}
							totais={[
								"Total",
								soma(professor.grades.map((g) => g.disciplinas)),
								soma(professor.grades.map((g) => g.aulasSemanais)),
								"",
								"",
								soma(professor.grades.map((g) => g.folhasGeradas)),
							]}
							vazio="Nenhuma grade vinculada."
						/>
					</Secao>

					<Secao titulo="Principais disciplinas">
						<RelatorioTabela
							colunas={["Disciplina", "Sigla", "Períodos letivos", "Aulas/semana (total)", "Último período"]}
							linhas={professor.principaisDisciplinas.map((d) => [
								d.nome,
								d.sigla ?? "—",
								d.periodosLetivos,
								d.aulasSemanaisTotal,
								d.ultimoPeriodo ?? "—",
							])}
							totais={[
								`Total: ${professor.principaisDisciplinas.length} disciplina(s)`,
								"",
								"",
								soma(professor.principaisDisciplinas.map((d) => d.aulasSemanaisTotal)),
								"",
							]}
							vazio="Nenhuma disciplina encontrada."
						/>
					</Secao>
				</>
			)}

			{!individual && (
				<Secao titulo="Por professor">
					<RelatorioTabela
						colunas={["Professor", "Matrícula", "Status", "Folhas no período", "% do período", "Total no histórico"]}
						linhas={data.porProfessor.map((p) => [
							p.nome,
							p.matricula ?? "—",
							p.status ?? "—",
							p.folhasNoPeriodo,
							`${formatNumber(p.percentualDoPeriodo, 1)}%`,
							p.totalHistorico,
						])}
						totais={[
							`Total: ${data.porProfessor.length} professor(es)`,
							"",
							"",
							soma(data.porProfessor.map((p) => p.folhasNoPeriodo)),
							"",
							soma(data.porProfessor.map((p) => p.totalHistorico)),
						]}
					/>
				</Secao>
			)}

			<Secao titulo="Por competência">
				<RelatorioTabela
					colunas={["Competência", "Folhas", "Professores"]}
					linhas={data.porCompetencia.map((c) => [c.competencia, c.folhas, c.professores])}
					totais={["Total", soma(data.porCompetencia.map((c) => c.folhas)), ""]}
				/>
			</Secao>

			<Secao titulo="Por usuário">
				<RelatorioTabela
					colunas={["Usuário", "Folhas geradas"]}
					linhas={data.porUsuario.map((u) => [u.usuario, u.quantidade])}
					totais={["Total", soma(data.porUsuario.map((u) => u.quantidade))]}
				/>
			</Secao>

			<Secao titulo="Evolução por dia">
				<RelatorioTabela
					colunas={["Dia", "Folhas"]}
					linhas={diasComMovimento.map((d) => [formatDate(d.data), d.quantidade])}
					totais={["Total", soma(diasComMovimento.map((d) => d.quantidade))]}
					nota="Só os dias com folhas geradas aparecem."
				/>
			</Secao>

			<Secao titulo="Folhas geradas no período">
				<RelatorioTabela
					colunas={["Data/hora", "Professor", "Competência", "Grade usada", "Dias sem aula", "Disciplinas", "Gerado por"]}
					linhas={detalhe.map((h) => [
						formatDateTime(h.dataHora),
						h.professor,
						h.competencia,
						h.periodoLetivoGrade
							? `${h.periodoLetivoGrade}${h.gradeOutroPeriodo ? " (outro período)" : ""}`
							: "—",
						h.diasSemAula,
						h.disciplinas,
						h.geradoPor ?? "—",
					])}
					totais={[
						`Total: ${data.historico.length} folha(s)`,
						"",
						"",
						"",
						"",
						"",
						"",
					]}
					nota={
						data.historico.length > LIMITE_DETALHE
							? `Mostrando as primeiras ${LIMITE_DETALHE} de ${data.historico.length}. A lista completa está no PDF/DOCX.`
							: undefined
					}
				/>
			</Secao>
		</div>
	);
}
