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
