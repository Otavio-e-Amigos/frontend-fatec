import {
	OPCOES_CONTRATO,
	OPCOES_PERIODO,
	OPCOES_STATUS,
	nomeDia,
	type GradeExtraida,
} from "./folha-ponto.types";

export type FolhaErros = {
	/** chave = caminho do campo, ex.: "professor.cpf", "disciplinas.0.aulas.1.horaFim" */
	campos: Record<string, string>;
	gerais: string[];
};

const HORA = /^([01]?\d|2[0-3]):([0-5]\d)$/;
const DATA = /^\d{4}-\d{2}-\d{2}$/;

function minutos(valor: string): number | null {
	const m = HORA.exec(valor.trim());
	return m ? Number(m[1]) * 60 + Number(m[2]) : null;
}

function dataValida(valor: string): boolean {
	if (!DATA.test(valor)) return false;
	const [y, m, d] = valor.split("-").map(Number);
	const dt = new Date(Date.UTC(y, m - 1, d));
	return (
		dt.getUTCFullYear() === y &&
		dt.getUTCMonth() === m - 1 &&
		dt.getUTCDate() === d
	);
}

const noLista = (lista: { value: string }[], valor: string) =>
	lista.some((o) => o.value === valor);

export const temErros = (e: FolhaErros) =>
	Object.keys(e.campos).length > 0 || e.gerais.length > 0;

export function validarFolha(g: GradeExtraida): FolhaErros {
	const campos: Record<string, string> = {};
	const gerais: string[] = [];

	// Período letivo
	if (g.semestre == null || g.semestre < 1 || g.semestre > 2)
		campos["semestre"] = "Semestre inválido (deve ser 1 ou 2).";
	if (g.ano == null || g.ano < 2000 || g.ano > 2100)
		campos["ano"] = "Ano inválido.";

	const iniOk = dataValida(g.validadeInicio);
	const fimOk = dataValida(g.validadeFim);
	if (!g.validadeInicio) campos["validadeInicio"] = "Informe a validade início.";
	else if (!iniOk) campos["validadeInicio"] = "Data inválida.";
	if (!g.validadeFim) campos["validadeFim"] = "Informe a validade fim.";
	else if (!fimOk) campos["validadeFim"] = "Data inválida.";
	if (iniOk && fimOk && g.validadeFim < g.validadeInicio)
		campos["validadeFim"] =
			"A validade fim não pode ser anterior à validade início.";

	// Professor
	const p = g.professor;
	if (!p.nome.trim()) campos["professor.nome"] = "Informe o nome do professor.";
	if (!p.matricula.trim())
		campos["professor.matricula"] = "Informe a matrícula.";
	if (p.cpf.replace(/\D/g, "").length !== 11)
		campos["professor.cpf"] = "CPF inválido (deve ter 11 dígitos).";
	if (!noLista(OPCOES_CONTRATO, p.contrato))
		campos["professor.contrato"] = "Selecione o contrato.";

	// Disciplinas e aulas
	if (!g.disciplinas.length) gerais.push("Adicione ao menos uma disciplina.");

	type Bloco = {
		i: number;
		j: number;
		rotulo: string;
		dia: number;
		hi: number;
		hf: number;
		ini: string;
		fim: string;
	};
	const blocos: Bloco[] = [];

	g.disciplinas.forEach((d, i) => {
		const base = `disciplinas.${i}`;
		const rotulo = d.nome.trim() || `Disciplina #${i + 1}`;

		if (!d.nome.trim()) campos[`${base}.nome`] = "Informe o nome.";
		if (!d.curso.trim()) campos[`${base}.curso`] = "Informe o curso.";
		if (!noLista(OPCOES_PERIODO, d.periodo))
			campos[`${base}.periodo`] = "Selecione o período.";
		if (!noLista(OPCOES_STATUS, d.status))
			campos[`${base}.status`] = "Selecione o status.";

		if (d.quantidadeAulas == null)
			campos[`${base}.quantidadeAulas`] = "Informe a quantidade de aulas.";
		else if (d.quantidadeAulas !== d.aulas.length)
			campos[`${base}.quantidadeAulas`] =
				`Informa ${d.quantidadeAulas} aula(s), mas há ${d.aulas.length} horário(s).`;

		d.aulas.forEach((a, j) => {
			const q = `${base}.aulas.${j}`;
			const diaOk = a.diaSemana != null && a.diaSemana >= 1 && a.diaSemana <= 7;
			const hi = minutos(a.horaInicio);
			const hf = minutos(a.horaFim);

			if (!diaOk) campos[`${q}.diaSemana`] = "Selecione o dia.";
			if (hi == null)
				campos[`${q}.horaInicio`] = a.horaInicio ? "Use HH:mm." : "Informe o início.";
			if (hf == null)
				campos[`${q}.horaFim`] = a.horaFim ? "Use HH:mm." : "Informe o término.";

			if (hi != null && hf != null && hf <= hi) {
				campos[`${q}.horaFim`] = "O término deve ser posterior ao início.";
			} else if (diaOk && hi != null && hf != null) {
				blocos.push({
					i,
					j,
					rotulo,
					dia: a.diaSemana as number,
					hi,
					hf,
					ini: a.horaInicio,
					fim: a.horaFim,
				});
			}
		});
	});

	// Sobreposição de horários no mesmo dia (entre quaisquer disciplinas)
	for (let x = 0; x < blocos.length; x++) {
		for (let y = x + 1; y < blocos.length; y++) {
			const a = blocos[x];
			const b = blocos[y];
			if (a.dia === b.dia && a.hi < b.hf && b.hi < a.hf) {
				gerais.push(
					`Conflito de horário na ${nomeDia(a.dia).toLowerCase()}: ${a.rotulo} (${a.ini}–${a.fim}) e ${b.rotulo} (${b.ini}–${b.fim}).`,
				);
				campos[`disciplinas.${a.i}.aulas.${a.j}.horaInicio`] ??=
					"Conflito de horário.";
				campos[`disciplinas.${b.i}.aulas.${b.j}.horaInicio`] ??=
					"Conflito de horário.";
			}
		}
	}

	return { campos, gerais };
}