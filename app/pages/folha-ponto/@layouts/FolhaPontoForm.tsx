import FormSection from "~/layouts/forms/FormSection";
import GenericFloor from "~/layouts/pages/GenericFloor";
import {
    OPCOES_CONTRATO,
    OPCOES_DIA,
    OPCOES_PERIODO,
    OPCOES_STATUS,
} from "~/modules/folha-ponto/folha-ponto.types";
import type { FolhaPontoState } from "../@hooks/useFolhaPonto";
import { CardHeader, Field, NumberInput, SelectInput, TextInput } from "./Field";
import CadastroBar from "./CadastroBar";
import {
    acharCurso, acharDisciplina, acharPeriodo, acharProfessor,
    valoresCurso, valoresDisciplina, valoresPeriodo, valoresProfessor,
} from "~/modules/folha-ponto/folha-ponto.cadastro";
const grid = "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4";

function formatarCpf(d: string) {
    return d
        .replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

export default function FolhaPontoForm({ state }: { state: FolhaPontoState }) {
    const { dados, erros, erro, exportando } = state;
    if (!dados || !erros) return null;
    const e = erros.campos;

    const { sistema } = state;
    const professorAchado = acharProfessor(sistema, dados.professor);
    const periodoAchado = acharPeriodo(sistema, dados);
    return (
        <GenericFloor
            header={
                <CardHeader
                    title="Revisão dos dados"
                    description="Confira e corrija os dados extraídos. Os campos em vermelho precisam de ajuste."
                />
            }
            className="flex flex-col gap-8 p-5"
        >
            {dados.avisos.length > 0 && (
                <div role="alert" className="rounded-lg bg-hint-alert p-3 text-sm text-hint-alert-fg">
                    <strong>Atenção ao extrair o arquivo:</strong>
                    <ul className="list-disc pl-5">
                        {dados.avisos.map((a, i) => <li key={i}>{a}</li>)}
                    </ul>
                </div>
            )}

            {erros.gerais.length > 0 && (
                <div role="alert" className="rounded-lg bg-hint-alert p-3 text-sm text-hint-alert-fg">
                    <ul className="list-disc pl-5">
                        {erros.gerais.map((g, i) => <li key={i}>{g}</li>)}
                    </ul>
                </div>
            )}

            <FormSection section="Período" description="Semestre letivo e validade da grade.">
                <div className={grid}>
                    <Field label="Semestre" required error={e["semestre"]}>
                        <NumberInput value={dados.semestre} min={1}
                            onChange={(v) => state.atualizar({ semestre: v })} error={e["semestre"]} />
                    </Field>
                    <Field label="Ano" required error={e["ano"]}>
                        <NumberInput value={dados.ano} min={2000}
                            onChange={(v) => state.atualizar({ ano: v })} error={e["ano"]} />
                    </Field>
                    <Field label="Validade início" required error={e["validadeInicio"]}>
                        <TextInput type="date" value={dados.validadeInicio}
                            onChange={(v) => state.atualizar({ validadeInicio: v })} error={e["validadeInicio"]} />
                    </Field>
                    <Field label="Validade fim" required error={e["validadeFim"]}>
                        <TextInput type="date" value={dados.validadeFim}
                            onChange={(v) => state.atualizar({ validadeFim: v })} error={e["validadeFim"]} />
                    </Field>
                </div>
            </FormSection>

            <FormSection section="Professor" description="Dados do docente identificados na grade.">
                <div className={grid}>
                    <Field label="Nome" required error={e["professor.nome"]}>
                        <TextInput value={dados.professor.nome}
                            onChange={(v) => state.atualizarProfessor({ nome: v })} error={e["professor.nome"]} />
                    </Field>
                    <Field label="Matrícula" required error={e["professor.matricula"]}>
                        <TextInput value={dados.professor.matricula} maxLength={10}
                            onChange={(v) => state.atualizarProfessor({ matricula: v })} error={e["professor.matricula"]} />
                    </Field>
                    <Field label="CPF" required error={e["professor.cpf"]}>
                        <TextInput value={formatarCpf(dados.professor.cpf)} maxLength={14}
                            onChange={(v) => state.atualizarProfessor({ cpf: v.replace(/\D/g, "").slice(0, 11) })}
                            error={e["professor.cpf"]} />
                    </Field>
                    <Field label="Contrato" required error={e["professor.contrato"]}>
                        <SelectInput value={dados.professor.contrato} options={OPCOES_CONTRATO}
                            onChange={(v) => state.atualizarProfessor({ contrato: v })} error={e["professor.contrato"]} />
                    </Field>
                </div>
                <CadastroBar
                    rotulo="Professor no sistema"
                    achado={professorAchado}
                    href={`/professor/${professorAchado?.id}`}
                    podeCadastrar
                    onCadastrar={() => state.abrirCadastro({ tipo: "professor", valores: valoresProfessor(dados) })}
                />
            </FormSection>

            <FormSection section="Carga horária" description="Horas semanais e mensais da grade.">
                <div className={grid}>
                    <Field label="Semanal (aula)">
                        <NumberInput value={dados.horas.semanalAula} step={0.5}
                            onChange={(v) => state.atualizarHoras({ semanalAula: v })} />
                    </Field>
                    <Field label="Mensal (aula)">
                        <NumberInput value={dados.horas.mensalAula} step={0.5}
                            onChange={(v) => state.atualizarHoras({ mensalAula: v })} />
                    </Field>
                    <Field label="Mensal (atividade 50%)">
                        <NumberInput value={dados.horas.mensalAtividade} step={0.5}
                            onChange={(v) => state.atualizarHoras({ mensalAtividade: v })} />
                    </Field>
                    <Field label="Total semanal">
                        <NumberInput value={dados.horas.totalSemanal} step={0.5}
                            onChange={(v) => state.atualizarHoras({ totalSemanal: v })} />
                    </Field>
                    <Field label="Total mensal">
                        <NumberInput value={dados.horas.totalMensal} step={0.5}
                            onChange={(v) => state.atualizarHoras({ totalMensal: v })} />
                    </Field>
                </div>
                <CadastroBar
                    rotulo="Período letivo no sistema"
                    achado={periodoAchado}
                    href={`/periodo-letivo/${periodoAchado?.id}`}
                    podeCadastrar={dados.ano != null && dados.semestre != null}
                    dica="Informe ano e semestre."
                    onCadastrar={() => state.abrirCadastro({ tipo: "periodo", valores: valoresPeriodo(dados) })}
                />
            </FormSection>

            <FormSection section="Disciplinas e horários" description="Cada disciplina com os dias e horários das aulas.">

                {dados.disciplinas.map((d, i) => {
                    const p = `disciplinas.${i}`;
                    const cursoCompleto = d.curso.trim() !== "" && OPCOES_PERIODO.some((o) => o.value === d.periodo);
                    const cursoAchado = cursoCompleto ? acharCurso(sistema, d.curso, d.periodo) : undefined;
                    const disciplinaAchada = d.nome.trim() ? acharDisciplina(sistema, d.nome) : undefined;
                    return (
                        <div key={i} className="flex flex-col gap-3 rounded-lg border border-line bg-surface-sunken p-4">
                            <div className={grid}>
                                <CadastroBar
                                    rotulo={`Curso (${d.curso || "—"})`}
                                    achado={cursoAchado}
                                    href={`/curso/${cursoAchado?.id}`}
                                    podeCadastrar={cursoCompleto}
                                    dica="Preencha o curso e o período."
                                    onCadastrar={() => state.abrirCadastro({ tipo: "curso", valores: valoresCurso(d.curso, d.periodo) })}
                                />
                                <CadastroBar
                                    rotulo={`Disciplina (${d.nome || "—"})`}
                                    achado={disciplinaAchada}
                                    href={`/disciplina/${disciplinaAchada?.id}`}
                                    podeCadastrar={d.nome.trim() !== ""}
                                    dica="Preencha o nome."
                                    onCadastrar={() => state.abrirCadastro({ tipo: "disciplina", valores: valoresDisciplina(d.nome) })}
                                />
                                <Field label="Disciplina" required error={e[`${p}.nome`]}>
                                    <TextInput value={d.nome} error={e[`${p}.nome`]}
                                        onChange={(v) => state.atualizarDisciplina(i, { nome: v })} />
                                </Field>
                                <Field label="Curso" required error={e[`${p}.curso`]}>
                                    <TextInput value={d.curso} error={e[`${p}.curso`]}
                                        onChange={(v) => state.atualizarDisciplina(i, { curso: v })} />
                                </Field>
                                <Field label="Período (turno do curso)" required error={e[`${p}.periodo`]}>
                                    <SelectInput value={d.periodo} options={OPCOES_PERIODO} error={e[`${p}.periodo`]}
                                        onChange={(v) => state.atualizarDisciplina(i, { periodo: v })} />
                                </Field>
                                <Field label="Status" required error={e[`${p}.status`]}>
                                    <SelectInput value={d.status} options={OPCOES_STATUS} error={e[`${p}.status`]}
                                        onChange={(v) => state.atualizarDisciplina(i, { status: v })} />
                                </Field>
                                <Field label="Qtde. de aulas" required error={e[`${p}.quantidadeAulas`]}>
                                    <NumberInput value={d.quantidadeAulas} error={e[`${p}.quantidadeAulas`]}
                                        onChange={(v) => state.atualizarDisciplina(i, { quantidadeAulas: v })} />
                                </Field>
                                <Field label="OP">
                                    <NumberInput value={d.op}
                                        onChange={(v) => state.atualizarDisciplina(i, { op: v })} />
                                </Field>
                            </div>

                            <div className="flex flex-col gap-2">
                                <p className="text-sm font-medium text-ink">Horários</p>
                                {d.aulas.map((a, j) => {
                                    const q = `${p}.aulas.${j}`;
                                    const cursoCompleto = d.curso.trim() !== "" && OPCOES_PERIODO.some((o) => o.value === d.periodo);
                                    const cursoAchado = cursoCompleto ? acharCurso(sistema, d.curso, d.periodo) : undefined;
                                    const disciplinaAchada = d.nome.trim() ? acharDisciplina(sistema, d.nome) : undefined;
                                    return (
                                        <div key={j} className="grid grid-cols-1 items-start gap-3 sm:grid-cols-[2fr_1fr_1fr_auto]">
                                            <Field label="Dia" error={e[`${q}.diaSemana`]}>
                                                <SelectInput value={a.diaSemana == null ? "" : String(a.diaSemana)}
                                                    options={OPCOES_DIA} error={e[`${q}.diaSemana`]}
                                                    onChange={(v) => state.atualizarAula(i, j, { diaSemana: v ? Number(v) : null })} />
                                            </Field>
                                            <Field label="Início" error={e[`${q}.horaInicio`]}>
                                                <TextInput type="time" value={a.horaInicio} error={e[`${q}.horaInicio`]}
                                                    onChange={(v) => state.atualizarAula(i, j, { horaInicio: v })} />
                                            </Field>
                                            <Field label="Término" error={e[`${q}.horaFim`]}>
                                                <TextInput type="time" value={a.horaFim} error={e[`${q}.horaFim`]}
                                                    onChange={(v) => state.atualizarAula(i, j, { horaFim: v })} />
                                            </Field>
                                            <button type="button" className="btn mt-5" data-variant="icon" data-icon="delete"
                                                aria-label="Remover horário" onClick={() => state.removerAula(i, j)}>
                                                Remover
                                            </button>
                                        </div>
                                    );
                                })}
                                <div className="flex gap-2">
                                    <button type="button" className="btn" data-variant="secondary"
                                        onClick={() => state.adicionarAula(i)}>
                                        Adicionar horário
                                    </button>
                                    <button type="button" className="btn" data-variant="danger"
                                        onClick={() => state.removerDisciplina(i)}>
                                        Remover disciplina
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div>
                    <button type="button" className="btn" data-variant="secondary" onClick={state.adicionarDisciplina}>
                        Adicionar disciplina
                    </button>
                </div>
            </FormSection>

            {erro && (
                <p role="alert" className="w-full text-right text-sm text-hint-alert-dot">
                    {erro}
                </p>
            )}

            <div className="flex justify-end gap-2">
                {/* Em breve: gera a folha de ponto a partir dos dados acima */}
                <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    title="Disponível em breve"
                    className="btn disabled:cursor-not-allowed disabled:bg-neutral-bg disabled:text-neutral-fg"
                >
                    Gerar Folha de Ponto
                </button>
                <button type="button" className="btn" disabled={exportando} onClick={state.exportar}>
                    {exportando ? "Validando..." : "Exportar"}
                </button>
            </div>
        </GenericFloor>
    );
}