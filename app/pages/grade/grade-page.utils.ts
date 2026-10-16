import type PeriodoLetivo from "~/modules/periodo-letivo/periodo-letivo.class";

export const weekdays = [
	{ value: 1, label: "Segunda" },
	{ value: 2, label: "Terça" },
	{ value: 3, label: "Quarta" },
	{ value: 4, label: "Quinta" },
	{ value: 5, label: "Sexta" },
	{ value: 6, label: "Sábado" },
	{ value: 7, label: "Domingo" },
];

export const shifts = ["MANHA", "TARDE", "NOITE"];

export const scheduleColors = [
	"var(--color-brand)",
	"var(--color-warn-fg)",
	"var(--color-brand-shade)",
	"var(--color-danger-fg)",
];

/** Converts a period into a sortable year-semester key. */
export function academicKey(period?: PeriodoLetivo) {
	return (period?.ano ?? 0) * 10 + (period?.semestre ?? 0);
}

/** Formats an academic period for display. */
export function periodLabel(period?: PeriodoLetivo) {
	return period
		? `${period.semestre}º semestre de ${period.ano}`
		: "Período letivo não encontrado";
}

/** Converts the API weekday number to its Portuguese label. */
export function displayDay(day: number) {
	return weekdays.find((weekday) => weekday.value === day)?.label ?? `Dia ${day}`;
}
