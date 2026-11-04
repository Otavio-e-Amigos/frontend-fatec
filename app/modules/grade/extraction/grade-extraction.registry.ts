import type Curso from "../../curso/curso.class";
import type Disciplina from "../../disciplina/disciplina.class";
import type PeriodoLetivo from "../../periodo-letivo/periodo-letivo.class";
import type Professor from "../../professor/professor.class";
import type { ExtractedGrade, ExtractedProfessor } from "./grade-extraction.types";

export type GradeRegistry = {
	professores: Professor[];
	periodos: PeriodoLetivo[];
	cursos: Curso[];
	disciplinas: Disciplina[];
};

export const normalize = (value?: string | null) =>
	(value ?? "")
		.normalize("NFD")
		.replace(/\p{M}/gu, "")
		.toLowerCase()
		.replace(/\s+/g, " ")
		.trim();

const digits = (value?: string | null) => (value ?? "").replace(/\D/g, "");

/** A course is unique by name + shift. */
export const courseKey = (name: string, shift: string) =>
	`${normalize(name)}|${shift}`;
export const disciplineKey = (name: string) => normalize(name);

export const findProfessor = (registry: GradeRegistry, professor: ExtractedProfessor) =>
	registry.professores.find(
		(item) =>
			(professor.matricula.trim() !== "" &&
				item.registry?.trim() === professor.matricula.trim()) ||
			(digits(professor.cpf).length === 11 &&
				digits(item.cpf) === digits(professor.cpf)),
	);

export const findPeriod = (registry: GradeRegistry, grade: ExtractedGrade) =>
	registry.periodos.find(
		(item) =>
			Number(item.ano) === grade.ano && Number(item.semestre) === grade.semestre,
	);

export const findCourse = (registry: GradeRegistry, name: string, shift: string) =>
	registry.cursos.find(
		(item) =>
			normalize(item.nome) === normalize(name) &&
			(item.turno ?? "").toUpperCase() === shift,
	);

export const findDiscipline = (registry: GradeRegistry, name: string) =>
	registry.disciplinas.find((item) => normalize(item.nome) === normalize(name));

/** Suggestion only: initials of words with 3+ letters (max 3). E.g. "Gestão de Recursos Humanos" -> GRH. */
export function suggestAcronym(name: string) {
	return normalize(name)
		.split(" ")
		.filter((word) => word.length > 2)
		.map((word) => word[0])
		.join("")
		.toUpperCase()
		.slice(0, 3);
}