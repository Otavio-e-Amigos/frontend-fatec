import type {
	ExtractedDiscipline,
	ExtractedGrade,
	ExtractedLesson,
} from "../grade-extraction.types";

type ApiRecord = Record<string, any>;

const text = (value: unknown) => (value == null ? "" : String(value));
const numberOrNull = (value: unknown) => {
	if (value == null || value === "") return null;
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : null;
};
const record = (value: unknown): ApiRecord =>
	typeof value === "object" && value !== null ? (value as ApiRecord) : {};
const records = (value: unknown): ApiRecord[] =>
	Array.isArray(value) ? value.map(record) : [];

/** Converts the API's "dados" object into the editable form state. */
export function fromApi(raw: unknown): ExtractedGrade {
	const data = record(raw);
	const professor = record(data.professor);
	const hours = record(data.horas);

	return {
		semestre: numberOrNull(data.semestre),
		ano: numberOrNull(data.ano),
		validadeInicio: text(data.validadeInicio),
		validadeFim: text(data.validadeFim),
		professor: {
			nome: text(professor.nome),
			matricula: text(professor.matricula),
			cpf: text(professor.cpf).replace(/\D/g, ""),
			contrato: text(professor.contrato),
		},
		horas: {
			semanalAula: numberOrNull(hours.semanalAula),
			mensalAula: numberOrNull(hours.mensalAula),
			mensalAtividade: numberOrNull(hours.mensalAtividade),
			totalSemanal: numberOrNull(hours.totalSemanal),
			totalMensal: numberOrNull(hours.totalMensal),
		},
		disciplinas: records(data.disciplinas).map((item) => ({
			nome: text(item.nome),
			curso: text(item.curso),
			periodo: text(item.periodo),
			status: text(item.status),
			quantidadeAulas: numberOrNull(item.quantidadeAulas),
			op: numberOrNull(item.op),
			aulas: records(item.aulas).map((lesson) => ({
				diaSemana: numberOrNull(lesson.diaSemana),
				horaInicio: text(lesson.horaInicio),
				horaFim: text(lesson.horaFim),
			})),
		})),
		avisos: Array.isArray(data.avisos) ? data.avisos.map(String) : [],
	};
}

/** Body sent to /validar: only the content of "dados", without the response wrapper. */
export function toApi(grade: ExtractedGrade) {
	return { ...grade, avisos: [] as string[] };
}

export const emptyLesson = (): ExtractedLesson => ({
	diaSemana: null,
	horaInicio: "",
	horaFim: "",
});

export const emptyDiscipline = (): ExtractedDiscipline => ({
	nome: "",
	curso: "",
	periodo: "",
	status: "MINISTRANDO",
	quantidadeAulas: 0,
	op: null,
	aulas: [],
});