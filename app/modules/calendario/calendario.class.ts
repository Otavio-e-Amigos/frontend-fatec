export interface EventoCalendarioInterface {
	/** Data no formato YYYY-MM-DD. É também o identificador do evento no Back. */
	data?: string;
	descricao?: string;
	tipo?: string;
	semAula?: boolean;
}

export default class EventoCalendario implements EventoCalendarioInterface {
	data?: string;
	descricao?: string;
	tipo?: string;
	semAula?: boolean;

	constructor(data: EventoCalendarioInterface) {
		Object.assign(this, data);
	}
}

/** Lista fechada de tipos (no Back o campo é texto livre). */
export const TIPOS_EVENTO: Record<string, string> = {
	Feriado: "FERIADO",
	Emenda: "EMENDA",
	Recesso: "RECESSO",
	"Sem aula": "SEM_AULA",
};

export function formatTipoEvento(tipo?: string) {
	const found = Object.entries(TIPOS_EVENTO).find(([, value]) => value === tipo);
	return found ? found[0] : (tipo ?? "");
}

/** Feriados fixos que o Back considera "sem aula" todo ano (MM-DD). Espelha o CalendarioAcademicoService. */
export const FERIADOS_FIXOS: Record<string, string> = {
	"01-01": "Confraternização Universal",
	"04-21": "Tiradentes",
	"05-01": "Dia do Trabalho",
	"07-09": "Revolução Constitucionalista (SP)",
	"09-07": "Independência do Brasil",
	"10-12": "Nossa Senhora Aparecida",
	"10-15": "Dia do Professor",
	"10-28": "Dia do Servidor Público",
	"11-02": "Finados",
	"11-15": "Proclamação da República",
	"11-20": "Consciência Negra",
	"12-25": "Natal",
};