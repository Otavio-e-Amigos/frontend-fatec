import type { GradeLessonPayload } from "./grade.service";

export interface GradeInterface {
	key: string;
	disciplinaId: number;
	disciplina: string;
	cursoId: number;
	curso: string;
	semestreCurso: number;
	periodo: string;
	quantidadeAulas: number;
	op: number | null;
	status: "MINISTRANDO";
	aulas: GradeLessonPayload[];
}

export default class Grade implements GradeInterface {
	declare key: string;
	declare disciplinaId: number;
	declare disciplina: string;
	declare cursoId: number;
	declare curso: string;
	declare semestreCurso: number;
	declare periodo: string;
	declare quantidadeAulas: number;
	declare op: number | null;
	declare status: "MINISTRANDO";
	declare aulas: GradeLessonPayload[];

	/** Creates a grade discipline with its associated schedule lessons. */
	constructor(data: GradeInterface) {
		Object.assign(this, data);
	}
}
