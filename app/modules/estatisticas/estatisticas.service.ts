import CursoService from "../curso/curso.service";
import DisciplinaService from "../disciplina/disciplina.service";
import GradeService from "../grade/grade.service";
import PeriodoLetivoService from "../periodo-letivo/periodo-letivo.service";
import ProfessorService from "../professor/professor.service";
import UserService from "../user/user.service";
import type User from "../user/user.class";

export type CadastroTotal = { name: string; value: number };

/** Roda a contagem; se uma lista falhar, ela só some do gráfico (não derruba a tela). */
async function count(name: string, load: () => Promise<{ length: number }>) {
	try {
		return { name, value: (await load()).length };
	} catch {
		return null;
	}
}

export default class EstatisticasService {
	/**
	 * Quantos itens existem em cada cadastro, usando os services que as telas já usam.
	 * Professores e disciplinas usam as rotas "todos/todas" porque a listagem normal é paginada.
	 */
	static async cadastros(auth: User): Promise<CadastroTotal[]> {
		const result = await Promise.all([
			count("Professores", async () => {
				const res = await ProfessorService.module.request({
					method: "GET",
					path: ["professores", "todos"],
					credentials: auth,
				});
				const raw = res.rawData;
				const items = raw?.dados ?? raw?.content ?? raw;
				return Array.isArray(items) ? items : [];
			}),
			count("Disciplinas", () => DisciplinaService.getAllForGrade(auth)),
			count("Cursos", () => CursoService.get(auth)),
			count("Períodos", () => PeriodoLetivoService.get(auth)),
			count("Grades", () => GradeService.getGrades(auth, { size: 1000 })),
			count("Usuários", async () => (await UserService.get(auth)) ?? []),
		]);

		return result.filter((item): item is CadastroTotal => item !== null);
	}
}
