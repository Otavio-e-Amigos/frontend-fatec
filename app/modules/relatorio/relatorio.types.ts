/** Tipos que espelham os DTOs de /api/relatorios (datas chegam como texto ISO). */

export type TipoPeriodo = "DIARIO" | "SEMANAL" | "MENSAL";
export type FormatoRelatorio = "PDF" | "DOCX";
export type TipoRelatorio = "EXTRACAO_GRADE" | "FOLHA_PONTO";

export type RelatorioFiltro = {
	periodo: TipoPeriodo;
	/** aaaa-mm-dd (qualquer dia dentro do período; não pode ser futura) */
	data: string;
	/** Só no relatório de folhas. Vazio = todos os professores. */
	professorId?: number;
};

export type PeriodoRelatorio = {
	tipo: TipoPeriodo;
	dataReferencia: string;
	dataInicio: string;
	dataFim: string;
	descricao: string;
	/** true quando o período ainda não terminou (dados parciais) */
	emAndamento: boolean;
};

// ---------------------------------------------------------------- Extração de grades

export type StatusExtracao = "SUCESSO" | "SUCESSO_COM_AVISOS" | "FALHA";

export type RelatorioExtracaoGrade = {
	periodo: PeriodoRelatorio;
	geradoEm: string;
	resumo: {
		totalExtracoes: number;
		gradesExtraidas: number;
		sucessoSemAvisos: number;
		sucessoComAvisos: number;
		falhas: number;
		taxaSucessoPercentual: number;
		totalDisciplinas: number;
		totalAulas: number;
		totalAvisos: number;
		mediaDisciplinasPorGrade: number;
		tempoMedioMs: number | null;
		tempoMaximoMs: number | null;
		professoresDistintos: number;
		professoresCadastrados: number;
		professoresNaoCadastrados: number;
		volumeTotalKb: number;
	};
	evolucaoDiaria: { data: string; total: number; sucesso: number; falhas: number }[];
	porUsuario: {
		usuarioId: number | null;
		usuario: string;
		total: number;
		sucesso: number;
		falhas: number;
	}[];
	porPeriodoLetivo: { ano: number; semestre: number; quantidade: number }[];
	principaisFalhas: { motivo: string; quantidade: number }[];
	extracoes: {
		id: number;
		dataHora: string;
		usuario: string | null;
		arquivo: string | null;
		tamanhoKb: number | null;
		status: StatusExtracao;
		professor: string | null;
		matricula: string | null;
		professorCadastrado: boolean;
		periodoLetivo: string | null;
		disciplinas: number;
		aulas: number;
		avisos: number;
		duracaoMs: number | null;
		mensagemErro: string | null;
	}[];
};

// ---------------------------------------------------------------- Folhas de ponto

export type RelatorioFolhaPonto = {
	periodo: PeriodoRelatorio;
	geradoEm: string;
	/** INDIVIDUAL (um professor) ou TODOS_PROFESSORES */
	escopo: "INDIVIDUAL" | "TODOS_PROFESSORES";
	resumo: {
		totalFolhas: number;
		professoresAtendidos: number;
		mediaFolhasPorProfessor: number;
		/** só no relatório geral */
		professoresAtivos?: number;
		professoresAtivosSemFolha?: number;
		competenciasDistintas: number;
		regeracoes: number;
		folhasComGradeDeOutroPeriodo: number;
	};
	porProfessor: {
		professorId: number;
		nome: string;
		matricula: string | null;
		status: string | null;
		folhasNoPeriodo: number;
		percentualDoPeriodo: number;
		totalHistorico: number;
		ultimaGeracao: string | null;
		competencias: string[];
	}[];
	evolucaoDiaria: { data: string; quantidade: number }[];
	porCompetencia: { competencia: string; folhas: number; professores: number }[];
	porUsuario: { usuarioId: number | null; usuario: string; quantidade: number }[];
	historico: {
		id: number;
		dataHora: string;
		professorId: number;
		professor: string;
		matricula: string | null;
		competencia: string;
		periodoLetivoGrade: string | null;
		gradeOutroPeriodo: boolean;
		diasSemAula: number;
		disciplinas: number;
		geradoPor: string | null;
	}[];
	/** só no relatório individual */
	professor?: {
		id: number;
		nome: string;
		codigo: string | null;
		matricula: string | null;
		titulacao: string | null;
		regimeJuridico: string | null;
		regimeContrato: string | null;
		status: string | null;
		totalFolhasHistorico: number;
		primeiraGeracao: string | null;
		ultimaGeracao: string | null;
		cursos: string[];
		grades: {
			gradeId: number;
			periodoLetivo: string;
			inicio: string;
			fim: string;
			cargaSemanal: number;
			cargaMensal: number;
			cargaTotal: number;
			disciplinas: number;
			disciplinasMinistrando: number;
			aulasSemanais: number;
			folhasGeradas: number;
		}[];
		principaisDisciplinas: {
			disciplinaId: number;
			sigla: string | null;
			nome: string;
			codigo: string | null;
			periodosLetivos: number;
			aulasSemanaisTotal: number;
			cursos: string[];
			ultimoPeriodo: string | null;
		}[];
	};
};
