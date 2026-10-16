import type Curso from "~/modules/curso/curso.class";
import type Disciplina from "~/modules/disciplina/disciplina.class";
import type PeriodoLetivo from "~/modules/periodo-letivo/periodo-letivo.class";
import type Professor from "~/modules/professor/professor.class";
import type {
	SavedGrade,
	SavedGradeDiscipline,
	SavedGradeLesson,
} from "~/modules/grade/grade.service";

export type GradePageProps = {
	professores: Professor[];
	periodos: PeriodoLetivo[];
	cursos: Curso[];
	disciplinas: Disciplina[];
};

export type ScheduleDiscipline = SavedGradeDiscipline & {
	name: string;
	course: string;
	shift: string;
	lessons: SavedGradeLesson[];
};

export type GradeDeleteTarget =
	| { kind: "grade"; grade: SavedGrade }
	| { kind: "discipline"; discipline: ScheduleDiscipline }
	| {
			kind: "lesson";
			discipline: ScheduleDiscipline;
			lesson: SavedGradeLesson;
	  };
