export type CategoriaNotificacao =
	| "EXTRACAO_GRADE"
	| "FOLHA_PONTO"
	| "RELATORIO"
	| "CALENDARIO";

export type Notificacao = {
	id: number;
	categoria: CategoriaNotificacao;
	tipo: string;
	titulo: string;
	mensagem: string;
	/** Recurso relacionado (ex.: CALENDARIO, REGISTRO_FOLHA_PONTO), quando houver */
	referenciaTipo: string | null;
	referenciaId: number | null;
	lida: boolean;
	/** Pendência que exige ação (ex.: confirmar o calendário do ano) */
	pendente: boolean;
	resolvidaEm: string | null;
	/** aaaa-mm-ddTHH:mm:ss */
	criadaEm: string;
};

export type NotificacaoContagem = {
	naoLidas: number;
	pendentes: number;
};
