import type Curso from "../curso/curso.class";
import type { CursoInterface } from "../curso/curso.class";
import type Disciplina from "../disciplina/disciplina.class";
import type { DisciplinaInterface } from "../disciplina/disciplina.class";
import type PeriodoLetivo from "../periodo-letivo/periodo-letivo.class";
import type { PeriodoLetivoInterface } from "../periodo-letivo/periodo-letivo.class";
import type Professor from "../professor/professor.class";
import type { ProfessorInterface } from "../professor/professor.class";
import type { GradeExtraida, ProfessorExtraido } from "./folha-ponto.types";

export type Sistema = {
	professores: Professor[];
	periodos: PeriodoLetivo[];
	cursos: Curso[];
	disciplinas: Disciplina[];
};

export type AlvoCadastro =
	| { tipo: "professor"; valores: ProfessorInterface }
	| { tipo: "periodo"; valores: PeriodoLetivoInterface }
	| { tipo: "curso"; valores: CursoInterface }
	| { tipo: "disciplina"; valores: DisciplinaInterface };

const norm = (s?: string | null) =>
	(s ?? "").normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/\s+/g, " ").trim();
const digitos = (s?: string | null) => (s ?? "").replace(/\D/g, "");

// --- busca no que já está cadastrado ---
export const acharProfessor = (s: Sistema, p: ProfessorExtraido) =>
	s.professores.find(
		(x) =>
			(p.matricula.trim() !== "" && x.registry?.trim() === p.matricula.trim()) ||
			(digitos(p.cpf).length === 11 && digitos(x.cpf) === digitos(p.cpf)),
	);

export const acharPeriodo = (s: Sistema, g: GradeExtraida) =>
	s.periodos.find((x) => Number(x.ano) === g.ano && Number(x.semestre) === g.semestre);

// curso é único por nome + turno
export const acharCurso = (s: Sistema, nome: string, turno: string) =>
	s.cursos.find(
		(x) => norm(x.nome) === norm(nome) && (x.turno ?? "").toUpperCase() === turno,
	);

export const acharDisciplina = (s: Sistema, nome: string) =>
	s.disciplinas.find((x) => norm(x.nome) === norm(nome));

// --- valores iniciais dos formulários ---
export const valoresProfessor = (g: GradeExtraida): ProfessorInterface => ({
	name: g.professor.nome,
	cpf: g.professor.cpf,
	registry: g.professor.matricula,
	contract: g.professor.contrato,
	status: "ATIVO",
});

export const valoresPeriodo = (g: GradeExtraida): PeriodoLetivoInterface => ({
	ano: g.ano ?? undefined,
	semestre: g.semestre ?? undefined,
	// datas ficam vazias de propósito: "validade da grade" não é o período letivo
});

/** Sugestão: iniciais das palavras com mais de 2 letras (máx. 3). Ex.: "Gestão de Recursos Humanos" -> GRH */
export function sugerirSigla(nome: string) {
	return norm(nome)
		.split(" ")
		.filter((w) => w.length > 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase()
		.slice(0, 3);
}

export const valoresCurso = (nome: string, turno: string): CursoInterface => ({
	nome: nome.trim(),
	turno,
	sigla: sugerirSigla(nome),
});

export const valoresDisciplina = (nome: string): DisciplinaInterface => ({
	nome: nome.trim(),
});