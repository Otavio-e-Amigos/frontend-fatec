import type {
	AulaExtraida,
	DisciplinaExtraida,
	GradeExtraida,
} from "../folha-ponto.types";

type Raw = Record<string, any>;

const str = (v: unknown) => (v == null ? "" : String(v));
const num = (v: unknown) => {
	if (v == null || v === "") return null;
	const n = Number(v);
	return Number.isFinite(n) ? n : null;
};
const obj = (v: unknown): Raw =>
	typeof v === "object" && v !== null ? (v as Raw) : {};
const list = (v: unknown): Raw[] => (Array.isArray(v) ? v.map(obj) : []);

/** Converte o objeto "dados" retornado pela API para o estado do formulário. */
export function fromApi(raw: unknown): GradeExtraida {
	const d = obj(raw);
	const p = obj(d.professor);
	const h = obj(d.horas);

	return {
		semestre: num(d.semestre),
		ano: num(d.ano),
		validadeInicio: str(d.validadeInicio),
		validadeFim: str(d.validadeFim),
		professor: {
			nome: str(p.nome),
			matricula: str(p.matricula),
			cpf: str(p.cpf).replace(/\D/g, ""),
			contrato: str(p.contrato),
		},
		horas: {
			semanalAula: num(h.semanalAula),
			mensalAula: num(h.mensalAula),
			mensalAtividade: num(h.mensalAtividade),
			totalSemanal: num(h.totalSemanal),
			totalMensal: num(h.totalMensal),
		},
		disciplinas: list(d.disciplinas).map((x) => ({
			nome: str(x.nome),
			curso: str(x.curso),
			periodo: str(x.periodo),
			status: str(x.status),
			quantidadeAulas: num(x.quantidadeAulas),
			op: num(x.op),
			aulas: list(x.aulas).map((a) => ({
				diaSemana: num(a.diaSemana),
				horaInicio: str(a.horaInicio),
				horaFim: str(a.horaFim),
			})),
		})),
		avisos: Array.isArray(d.avisos) ? d.avisos.map(String) : [],
	};
}

/** Corpo enviado ao /validar: só o conteúdo de "dados", sem o wrapper de resposta. */
export function toApi(grade: GradeExtraida) {
	return { ...grade, avisos: [] as string[] };
}

export const novaAula = (): AulaExtraida => ({
	diaSemana: null,
	horaInicio: "",
	horaFim: "",
});

export const novaDisciplina = (): DisciplinaExtraida => ({
	nome: "",
	curso: "",
	periodo: "",
	status: "MINISTRANDO",
	quantidadeAulas: 0,
	op: null,
	aulas: [],
});