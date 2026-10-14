import type AbstractQueryObject from "../api/base/AbstractQueryObject";
import DefaultAPIData from "../api/modules/default/DefaultAPIData";
import { DefaultAPIModule } from "../api/modules/default/DefaultAPIModule";
import type User from "../user/user.class";
import gradeRoutes from "./api/grade.routes";

export type GradeCreatePayload = {
	professorId: number;
	periodoLetivoId: number;
	semanal: number;
	mensal: number;
	total: number;
};

export type GradeDisciplinePayload = {
	gradeId: number;
	disciplinaId: number;
	cursoId: number;
	semestreCurso: number;
	periodo: string;
	quantidadeAulas: number;
	op: number | null;
	status: "MINISTRANDO";
};

export type GradeLessonPayload = {
	diaSemana: number;
	horaInicio: string;
	horaFim: string;
};

export type SavedGrade = {
	id: number;
	professorId: number;
	periodoLetivoId: number;
	semanal: number;
	mensal: number;
	total: number;
};

export type SavedGradeDiscipline = {
	id: number;
	gradeId: number;
	disciplinaId: number;
	cursoId: number;
	semestreCurso: number;
	periodo: string;
	quantidadeAulas: number;
	op?: number | null;
	status: string;
};

export type SavedGradeLesson = GradeLessonPayload & {
	id: number;
	disciplinaGradeId: number;
};

export default class GradeService {
	static module = new DefaultAPIModule();

	private static async request(
		request: AbstractQueryObject,
		auth: User,
	): Promise<DefaultAPIData> {
		try {
			return await this.module.request({ ...request, credentials: auth });
		} catch (error) {
			if (error instanceof DefaultAPIData) {
				const message = error.rawData?.mensagem;
				if (typeof message === "string" && message.trim()) {
					throw new Error(message);
				}
			}
			throw error;
		}
	}

	private static responseData(response: DefaultAPIData): any {
		return response.rawData?.dados ?? response.rawData;
	}

	private static responseList(response: DefaultAPIData): any[] {
		const data = this.responseData(response);
		if (Array.isArray(data)) return data;
		if (Array.isArray(data?.content)) return data.content;
		return [];
	}

	private static responseId(response: DefaultAPIData, label: string): number {
		const id = Number(this.responseData(response)?.id);
		if (!Number.isSafeInteger(id) || id < 1) {
			throw new Error(`A API não retornou o identificador de ${label}.`);
		}
		return id;
	}

	static async createGrade(
		payload: GradeCreatePayload,
		auth: User,
	): Promise<number> {
		const response = await this.request(
			{ ...gradeRoutes.CREATE, body: payload },
			auth,
		);
		return this.responseId(response, "grade");
	}

	static async createDiscipline(
		payload: GradeDisciplinePayload,
		auth: User,
	): Promise<number> {
		const response = await this.request(
			{ ...gradeRoutes.CREATE_DISCIPLINE, body: payload },
			auth,
		);
		return this.responseId(response, "disciplina da grade");
	}

	static async createLesson(
		disciplineGradeId: number,
		payload: GradeLessonPayload,
		auth: User,
	): Promise<void> {
		await this.request(
			{
				...gradeRoutes.CREATE_LESSON,
				path: [
					"aulas-grade",
					"disciplinas-grade",
					disciplineGradeId,
					"aulas",
				],
				body: payload,
			},
			auth,
		);
	}

	static async getOpOptions(professorId: number, auth: User): Promise<number[]> {
		const grades = await this.getProfessorGrades(professorId, auth);
		const opValues = new Set<number>();

		for (const grade of grades) {
			for (const discipline of await this.getGradeDisciplines(grade.id, auth)) {
				const op = Number(discipline.op);
				if (Number.isInteger(op) && op >= 0 && op <= 999) opValues.add(op);
			}
		}

		return [...opValues].sort((a, b) => a - b);
	}

	static async getProfessorGrades(
		professorId: number,
		auth: User,
	): Promise<SavedGrade[]> {
		const response = await this.request(
			{
				...gradeRoutes.GET_BY_PROFESSOR,
				path: ["professores", professorId, "grades"],
			},
			auth,
		);
		return this.responseList(response)
			.map((grade) => ({
				id: Number(grade.id),
				professorId: Number(grade.professorId),
				periodoLetivoId: Number(grade.periodoLetivoId),
				semanal: Number(grade.semanal),
				mensal: Number(grade.mensal),
				total: Number(grade.total),
			}))
			.filter(
				(grade) =>
					Number.isSafeInteger(grade.id) &&
					Number.isSafeInteger(grade.periodoLetivoId),
			);
	}

	static async getGradeDisciplines(
		gradeId: number,
		auth: User,
	): Promise<SavedGradeDiscipline[]> {
		const response = await this.request(
			{
				...gradeRoutes.GET_DISCIPLINES,
				path: ["grades", gradeId, "disciplinas"],
			},
			auth,
		);
		return this.responseList(response)
			.map((discipline) => ({
				id: Number(discipline.id),
				gradeId: Number(discipline.gradeId),
				disciplinaId: Number(discipline.disciplinaId),
				cursoId: Number(discipline.cursoId),
				semestreCurso: Number(discipline.semestreCurso),
				periodo: String(discipline.periodo ?? ""),
				quantidadeAulas: Number(discipline.quantidadeAulas),
				op: discipline.op == null ? null : Number(discipline.op),
				status: String(discipline.status ?? ""),
			}))
			.filter(
				(discipline) =>
					Number.isSafeInteger(discipline.id) &&
					Number.isSafeInteger(discipline.disciplinaId),
			);
	}

	static async getDisciplineLessons(
		disciplineGradeId: number,
		auth: User,
	): Promise<SavedGradeLesson[]> {
		const response = await this.request(
			{
				...gradeRoutes.GET_LESSONS,
				path: ["disciplinas-grade", disciplineGradeId, "aulas"],
			},
			auth,
		);
		return this.responseList(response)
			.map((lesson) => ({
				id: Number(lesson.id),
				disciplinaGradeId: Number(lesson.disciplinaGradeId),
				diaSemana: Number(lesson.diaSemana),
				horaInicio: String(lesson.horaInicio ?? ""),
				horaFim: String(lesson.horaFim ?? ""),
			}))
			.filter(
				(lesson) =>
					Number.isSafeInteger(lesson.id) &&
					Number.isInteger(lesson.diaSemana),
			);
	}
}
