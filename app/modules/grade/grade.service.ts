import type AbstractQueryObject from "../api/base/AbstractQueryObject";
import DefaultAPIData from "../api/modules/default/DefaultAPIData";
import { DefaultAPIModule } from "../api/modules/default/DefaultAPIModule";
import type User from "../user/user.class";
import gradeRoutes from "./api/grade.routes";

type ApiRecord = Record<string, unknown>;

function isApiRecord(value: unknown): value is ApiRecord {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

export type GradeCreatePayload = {
	professorId: number;
	periodoLetivoId: number;
	semanal?: number | null;
	mensal?: number | null;
	total?: number | null;
};

export type GradeDisciplinePayload = {
	gradeId: number;
	disciplinaId: number;
	cursoId: number;
	semestreCurso?: number;
	periodo?: string;
	quantidadeAulas: number;
	op?: number | null;
	status: GradeDisciplineStatus;
};

export type GradeDisciplineStatus = "MINISTRANDO" | "CANCELADA";

export type GradeLessonPayload = {
	diaSemana: number;
	horaInicio: string;
	horaFim: string;
};

export type GradeListOptions = {
	page?: number;
	size?: number;
	sort?: string[];
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
	op: number | null;
	status: GradeDisciplineStatus;
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
		fallbackMessages: Record<number, string> = {},
	): Promise<DefaultAPIData> {
		try {
			return await this.module.request({ ...request, credentials: auth });
		} catch (error) {
			if (error instanceof DefaultAPIData) {
				const message = error.rawData?.mensagem;
				if (typeof message === "string" && message.trim()) {
					throw new Error(message);
				}
				const fallbackMessage = fallbackMessages[error.status];
				if (fallbackMessage) throw new Error(fallbackMessage);
			}
			throw error;
		}
	}

	private static responseData(response: DefaultAPIData): unknown {
		return response.rawData?.dados ?? response.rawData;
	}

	private static responseList(response: DefaultAPIData): unknown[] {
		const data = this.responseData(response);
		if (Array.isArray(data)) return data;
		if (isApiRecord(data) && Array.isArray(data.content)) return data.content;
		throw new Error("A API retornou uma lista em formato inválido.");
	}

	private static responseId(response: DefaultAPIData, label: string): number {
		const data = this.responseData(response);
		const id = Number(isApiRecord(data) ? data.id : undefined);
		if (!Number.isSafeInteger(id) || id < 1) {
			throw new Error(`A API não retornou o identificador de ${label}.`);
		}
		return id;
	}

	static async getGrades(
		auth: User,
		options: GradeListOptions = {},
	): Promise<SavedGrade[]> {
		const { page = 0, size = 10, sort = [] } = options;
		if (!Number.isSafeInteger(page) || page < 0) {
			throw new Error("A página das grades deve ser um inteiro maior ou igual a zero.");
		}
		if (!Number.isSafeInteger(size) || size < 1) {
			throw new Error("O tamanho da página deve ser um inteiro positivo.");
		}
		if (sort.some((value) => !value.trim())) {
			throw new Error("Os critérios de ordenação não podem estar vazios.");
		}

		const response = await this.request(
			{
				...gradeRoutes.GET_ALL,
				arguments: [
					{ param: "page", value: page },
					{ param: "size", value: size },
					...sort.map((value) => ({ param: "sort", value })),
				],
			},
			auth,
		);
		return this.responseList(response).map((grade) =>
			this.toSavedGrade(grade),
		);
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

	static async getGrade(id: number, auth: User): Promise<SavedGrade> {
		const response = await this.request(
			{ ...gradeRoutes.GET_BY_ID, path: ["grades", id] },
			auth,
		);
		return this.toSavedGrade(this.responseData(response));
	}

	static async updateGrade(
		id: number,
		payload: GradeCreatePayload,
		auth: User,
	): Promise<SavedGrade> {
		const response = await this.request(
			{ ...gradeRoutes.UPDATE, path: ["grades", id], body: payload },
			auth,
		);
		return this.toSavedGrade(this.responseData(response));
	}

	static async deleteGrade(id: number, auth: User): Promise<void> {
		await this.request(
			{ ...gradeRoutes.DELETE, path: ["grades", id] },
			auth,
			{
				409: "A grade não pode ser excluída enquanto houver disciplinas vinculadas.",
			},
		);
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

	static async getDisciplineGrade(
		id: number,
		auth: User,
	): Promise<SavedGradeDiscipline> {
		const response = await this.request(
			{ ...gradeRoutes.GET_DISCIPLINE_BY_ID, path: ["disciplinas-grade", id] },
			auth,
		);
		return this.toSavedDiscipline(this.responseData(response));
	}

	static async updateDisciplineGrade(
		id: number,
		payload: GradeDisciplinePayload,
		auth: User,
	): Promise<SavedGradeDiscipline> {
		const response = await this.request(
			{
				...gradeRoutes.UPDATE_DISCIPLINE,
				path: ["disciplinas-grade", id],
				body: payload,
			},
			auth,
		);
		return this.toSavedDiscipline(this.responseData(response));
	}

	static async deleteDisciplineGrade(id: number, auth: User): Promise<void> {
		await this.request(
			{
				...gradeRoutes.DELETE_DISCIPLINE,
				path: ["disciplinas-grade", id],
			},
			auth,
		);
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

	static async deleteLesson(id: number, auth: User): Promise<void> {
		await this.request(
			{ ...gradeRoutes.DELETE_LESSON, path: ["aulas-grade", id] },
			auth,
			{ 404: "O horário não foi encontrado ou já foi removido." },
		);
	}

	static async getLesson(id: number, auth: User): Promise<SavedGradeLesson> {
		const response = await this.request(
			{ ...gradeRoutes.GET_LESSON_BY_ID, path: ["aulas-grade", id] },
			auth,
		);
		return this.toSavedLesson(this.responseData(response));
	}

	static async updateLesson(
		id: number,
		payload: GradeLessonPayload,
		auth: User,
	): Promise<SavedGradeLesson> {
		const response = await this.request(
			{
				...gradeRoutes.UPDATE_LESSON,
				path: ["aulas-grade", id],
				body: payload,
			},
			auth,
			{
				400: "A API recusou os dados informados para o horário.",
				404: "O horário não foi encontrado.",
				409: "Este horário conflita com outra aula. Escolha outro dia ou intervalo.",
			},
		);
		return this.toSavedLesson(this.responseData(response));
	}

	static async getOpOptions(professorId: number, auth: User): Promise<number[]> {
		const grades = await this.getProfessorGrades(professorId, auth);
		const opValues = new Set<number>();

		for (const grade of grades) {
			for (const discipline of await this.getGradeDisciplines(grade.id, auth)) {
				const op = discipline.op;
				if (op !== null && Number.isInteger(op) && op >= 0 && op <= 999) {
					opValues.add(op);
				}
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
		return this.responseList(response).map((grade) => this.toSavedGrade(grade));
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
		return this.responseList(response).map((discipline) =>
			this.toSavedDiscipline(discipline),
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
		return this.responseList(response).map((lesson) =>
			this.toSavedLesson(lesson),
		);
	}

	private static toSavedGrade(value: unknown): SavedGrade {
		if (!isApiRecord(value)) {
			throw new Error("A API retornou uma grade em formato inválido.");
		}
		const grade: SavedGrade = {
			id: Number(value.id),
			professorId: Number(value.professorId),
			periodoLetivoId: Number(value.periodoLetivoId),
			semanal: Number(value.semanal),
			mensal: Number(value.mensal),
			total: Number(value.total),
		};
		if (
			![grade.id, grade.professorId, grade.periodoLetivoId].every(
				(id) => Number.isSafeInteger(id) && id > 0,
			) ||
			![grade.semanal, grade.mensal, grade.total].every(Number.isFinite)
		) {
			throw new Error("A API retornou uma grade em formato inválido.");
		}
		return grade;
	}

	private static toSavedDiscipline(value: unknown): SavedGradeDiscipline {
		if (!isApiRecord(value)) {
			throw new Error("A API retornou uma disciplina da grade em formato inválido.");
		}
		const status = String(value.status);
		if (status !== "MINISTRANDO" && status !== "CANCELADA") {
			throw new Error(
				"A API retornou um status inválido para a disciplina da grade.",
			);
		}
		const discipline: SavedGradeDiscipline = {
			id: Number(value.id),
			gradeId: Number(value.gradeId),
			disciplinaId: Number(value.disciplinaId),
			cursoId: Number(value.cursoId),
			semestreCurso: Number(value.semestreCurso),
			periodo: String(value.periodo ?? ""),
			quantidadeAulas: Number(value.quantidadeAulas),
			op: value.op == null ? null : Number(value.op),
			status,
		};
		const ids = [
			discipline.id,
			discipline.gradeId,
			discipline.disciplinaId,
			discipline.cursoId,
		];
		if (
			!ids.every((id) => Number.isSafeInteger(id) && id > 0) ||
			!Number.isSafeInteger(discipline.semestreCurso) ||
			!Number.isSafeInteger(discipline.quantidadeAulas) ||
			(discipline.op !== null && !Number.isSafeInteger(discipline.op))
		) {
			throw new Error("A API retornou uma disciplina da grade em formato inválido.");
		}
		return discipline;
	}

	private static toSavedLesson(value: unknown): SavedGradeLesson {
		if (!isApiRecord(value)) {
			throw new Error("A API retornou uma aula da grade em formato inválido.");
		}
		const lesson: SavedGradeLesson = {
			id: Number(value.id),
			disciplinaGradeId: Number(value.disciplinaGradeId),
			diaSemana: Number(value.diaSemana),
			horaInicio: String(value.horaInicio ?? ""),
			horaFim: String(value.horaFim ?? ""),
		};
		if (
			!Number.isSafeInteger(lesson.id) ||
			lesson.id < 1 ||
			!Number.isSafeInteger(lesson.disciplinaGradeId) ||
			lesson.disciplinaGradeId < 1 ||
			!Number.isInteger(lesson.diaSemana) ||
			lesson.diaSemana < 1 ||
			lesson.diaSemana > 7 ||
			!lesson.horaInicio ||
			!lesson.horaFim
		) {
			throw new Error("A API retornou uma aula da grade em formato inválido.");
		}
		return lesson;
	}
}
