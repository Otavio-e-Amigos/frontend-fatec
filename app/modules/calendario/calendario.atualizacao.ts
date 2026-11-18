/** Situação da confirmação anual do calendário (GET /api/calendario/atualizacao/{ano}). */
export type StatusAtualizacao = {
	ano: number;
	atualizado: boolean;
	/** aaaa-mm-ddTHH:mm:ss */
	atualizadoEm: string | null;
	atualizadoPor: string | null;
	observacao: string | null;
	eventosCadastradosNoAno: number;
	/** Lembrete de fevereiro ativo agora para este ano */
	lembreteAtivo: boolean;
};
