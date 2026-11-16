import { TIPOS_EVENTO } from "./calendario.class";
import type EventoCalendario from "./calendario.class";

export type EventoImportado = {
	data: string;
	descricao: string;
	tipo: string;
	semAula: boolean;
};

const DATE = /^\d{4}-\d{2}-\d{2}$/;

function isRealDate(value: string) {
	if (!DATE.test(value)) return false;
	const [y, m, d] = value.split("-").map(Number);
	const date = new Date(Date.UTC(y, m - 1, d));
	return (
		date.getUTCFullYear() === y &&
		date.getUTCMonth() === m - 1 &&
		date.getUTCDate() === d
	);
}

/** Export file: { versao, eventos }. Only registered events (fixed holidays are built into the system). */
export function exportCalendarioJson(events: EventoCalendario[]): string {
	return JSON.stringify(
		{
			versao: 1,
			eventos: events.map((event) => ({
				data: event.data ?? "",
				descricao: event.descricao ?? "",
				tipo: event.tipo ?? "",
				semAula: Boolean(event.semAula),
			})),
		},
		null,
		2,
	);
}

/** Reads an import file ({ eventos: [...] } or a plain array) and lists every problem found. */
export function parseCalendarioJson(text: string): {
	events: EventoImportado[];
	errors: string[];
} {
	let raw: unknown;
	try {
		raw = JSON.parse(text);
	} catch {
		return { events: [], errors: ["O arquivo não é um JSON válido."] };
	}

	const list = Array.isArray(raw) ? raw : (raw as { eventos?: unknown })?.eventos;
	if (!Array.isArray(list)) {
		return { events: [], errors: ['Formato inválido: esperado { "eventos": [...] }.'] };
	}

	const validTypes = Object.values(TIPOS_EVENTO);
	const events: EventoImportado[] = [];
	const errors: string[] = [];
	const seen = new Set<string>();

	list.forEach((item, index) => {
		const label = `Item ${index + 1}`;
		const data = String(item?.data ?? "");
		const descricao = String(item?.descricao ?? "").trim();
		const tipo = String(item?.tipo ?? "");
		const semAula = item?.semAula ?? true;

		if (!isRealDate(data)) {
			errors.push(`${label}: data inválida (use aaaa-mm-dd).`);
			return;
		}
		if (seen.has(data)) {
			errors.push(`${label}: a data ${data} aparece mais de uma vez.`);
			return;
		}
		if (!descricao) {
			errors.push(`${label} (${data}): descrição obrigatória.`);
			return;
		}
		if (!validTypes.includes(tipo)) {
			errors.push(`${label} (${data}): tipo inválido (use ${validTypes.join(", ")}).`);
			return;
		}
		if (typeof semAula !== "boolean") {
			errors.push(`${label} (${data}): "semAula" deve ser true ou false.`);
			return;
		}

		seen.add(data);
		events.push({ data, descricao, tipo, semAula });
	});

	return { events, errors };
}