import type { TipoPeriodo } from "~/modules/relatorio/relatorio.types";

export const PERIODOS: Record<string, TipoPeriodo> = {
	Diário: "DIARIO",
	Semanal: "SEMANAL",
	Mensal: "MENSAL",
};

const pad = (value: number) => String(value).padStart(2, "0");

/** Hoje no fuso do navegador, como aaaa-mm-dd (o Back não aceita data futura). */
export function hojeISO() {
	const now = new Date();
	return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/**
 * Data de referência para um mês da folha de ponto: o último dia do mês, mas
 * nunca depois de hoje (mês atual ou futuro usa hoje).
 */
export function dataDoMes(ano: string, mes: string) {
	const year = Number(ano);
	const month = Number(mes);
	if (!Number.isInteger(year) || !Number.isInteger(month)) return hojeISO();

	const lastDay = new Date(year, month, 0).getDate();
	const iso = `${year}-${pad(month)}-${pad(lastDay)}`;
	return iso > hojeISO() ? hojeISO() : iso;
}

/** 2026-11-16T14:30:00 -> 16/11/2026 14:30 */
export function formatDateTime(value?: string | null) {
	if (!value) return "—";
	const [date, time = ""] = value.split("T");
	const [y, m, d] = date.split("-");
	return `${d}/${m}/${y}${time ? ` ${time.slice(0, 5)}` : ""}`;
}

export const formatNumber = (value?: number | null, digits = 0) =>
	value === null || value === undefined
		? "—"
		: value.toLocaleString("pt-BR", {
				minimumFractionDigits: digits,
				maximumFractionDigits: digits,
			});

export function formatDuration(ms?: number | null) {
	if (ms === null || ms === undefined) return "—";
	return ms < 1000 ? `${ms} ms` : `${(ms / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} s`;
}

export const STATUS_EXTRACAO: Record<string, string> = {
	SUCESSO: "Sucesso",
	SUCESSO_COM_AVISOS: "Sucesso com avisos",
	FALHA: "Falha",
};
