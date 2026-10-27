export type AulaExtraida = {
	diaSemana: number | null;
	horaInicio: string;
	horaFim: string;
};

export type DisciplinaExtraida = {
	nome: string;
	curso: string;
	periodo: string;
	status: string;
	quantidadeAulas: number | null;
	op: number | null;
	aulas: AulaExtraida[];
};

export type ProfessorExtraido = {
	nome: string;
	matricula: string;
	cpf: string; // somente dígitos
	contrato: string;
};

export type HorasExtraidas = {
	semanalAula: number | null;
	mensalAula: number | null;
	mensalAtividade: number | null;
	totalSemanal: number | null;
	totalMensal: number | null;
};

export type GradeExtraida = {
	semestre: number | null;
	ano: number | null;
	validadeInicio: string; // yyyy-MM-dd
	validadeFim: string; // yyyy-MM-dd
	professor: ProfessorExtraido;
	horas: HorasExtraidas;
	disciplinas: DisciplinaExtraida[];
	avisos: string[];
};

export type Opcao = { value: string; label: string };

export const OPCOES_PERIODO: Opcao[] = [
	{ value: "MANHA", label: "Manhã" },
	{ value: "TARDE", label: "Tarde" },
	{ value: "NOITE", label: "Noite" },
];

export const OPCOES_CONTRATO: Opcao[] = [
	{ value: "DETERMINADO", label: "Determinado" },
	{ value: "INDETERMINADO", label: "Indeterminado" },
	{ value: "TEMPORARIO", label: "Temporário" },
];

export const OPCOES_STATUS: Opcao[] = [
	{ value: "MINISTRANDO", label: "Ministrando" },
	{ value: "CANCELADA", label: "Cancelada" },
];

export const OPCOES_DIA: Opcao[] = [
	{ value: "1", label: "Segunda-feira" },
	{ value: "2", label: "Terça-feira" },
	{ value: "3", label: "Quarta-feira" },
	{ value: "4", label: "Quinta-feira" },
	{ value: "5", label: "Sexta-feira" },
	{ value: "6", label: "Sábado" },
	{ value: "7", label: "Domingo" },
];

export const nomeDia = (dia: number | null) =>
	OPCOES_DIA.find((o) => o.value === String(dia))?.label ?? "";