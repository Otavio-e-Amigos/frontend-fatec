export type ExtractedLesson = {
	diaSemana: number | null;
	horaInicio: string;
	horaFim: string;
};

export type ExtractedDiscipline = {
	nome: string;
	curso: string;
	periodo: string;
	status: string;
	quantidadeAulas: number | null;
	op: number | null;
	aulas: ExtractedLesson[];
};

export type ExtractedProfessor = {
	nome: string;
	matricula: string;
	cpf: string;
	contrato: string;
};

export type ExtractedHours = {
	semanalAula: number | null;
	mensalAula: number | null;
	mensalAtividade: number | null;
	totalSemanal: number | null;
	totalMensal: number | null;
};

export type ExtractedGrade = {
	semestre: number | null;
	ano: number | null;
	validadeInicio: string;
	validadeFim: string;
	professor: ExtractedProfessor;
	horas: ExtractedHours;
	disciplinas: ExtractedDiscipline[];
	avisos: string[];
};

/** Data the PDF does not carry, but the registrations require. */
export type GradeImportExtras = {
	professorTitle: string;
	professorCode: string;
	periodStart: string;
	periodEnd: string;
	courseAcronyms: Record<string, string>;
	disciplineCodes: Record<string, string>;
	disciplineAcronyms: Record<string, string>;
};

export const emptyExtras = (): GradeImportExtras => ({
	professorTitle: "",
	professorCode: "",
	periodStart: "",
	periodEnd: "",
	courseAcronyms: {},
	disciplineCodes: {},
	disciplineAcronyms: {},
});

export type ImportedGradeResult = {
	professorId: number;
	month: number | null;
	year: number | null;
	summary: string[];
};

export type Option = { value: string; label: string };

export const PERIOD_OPTIONS: Option[] = [
	{ value: "MANHA", label: "Manhã" },
	{ value: "TARDE", label: "Tarde" },
	{ value: "NOITE", label: "Noite" },
];

export const CONTRACT_OPTIONS: Option[] = [
	{ value: "DETERMINADO", label: "Determinado" },
	{ value: "INDETERMINADO", label: "Indeterminado" },
	{ value: "TEMPORARIO", label: "Temporário" },
];

export const STATUS_OPTIONS: Option[] = [
	{ value: "MINISTRANDO", label: "Ministrando" },
	{ value: "CANCELADA", label: "Cancelada" },
];

export const TITLE_OPTIONS: Option[] = [
	{ value: "GRADUADO", label: "Graduado" },
	{ value: "ESPECIALISTA", label: "Especialista" },
	{ value: "MESTRE", label: "Mestre" },
	{ value: "DOUTOR", label: "Doutor" },
	{ value: "POS_DOUTOR", label: "Pós-doutor" },
];

export const WEEKDAY_OPTIONS: Option[] = [
	{ value: "1", label: "Segunda-feira" },
	{ value: "2", label: "Terça-feira" },
	{ value: "3", label: "Quarta-feira" },
	{ value: "4", label: "Quinta-feira" },
	{ value: "5", label: "Sexta-feira" },
	{ value: "6", label: "Sábado" },
	{ value: "7", label: "Domingo" },
];

export const weekdayLabel = (day: number | null) =>
	WEEKDAY_OPTIONS.find((option) => option.value === String(day))?.label ?? "";