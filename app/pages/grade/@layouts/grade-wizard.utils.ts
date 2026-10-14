import type PeriodoLetivo from "~/modules/periodo-letivo/periodo-letivo.class";
import type { GradeLessonPayload } from "~/modules/grade/grade.service";
import type Grade from "~/modules/grade/grade.class";

export type Shift = {
	value: string;
	label: string;
	minStart: number;
	maxEnd: number;
	slots: Array<{ start: string; end: string }>;
};

export const shifts: Shift[] = [
	{
		value: "MANHA",
		label: "Manhã",
		minStart: 7 * 60,
		maxEnd: 12 * 60 + 50,
		slots: [
			{ start: "07:30", end: "08:20" },
			{ start: "08:20", end: "09:10" },
			{ start: "09:20", end: "10:10" },
			{ start: "10:10", end: "11:00" },
			{ start: "11:10", end: "12:00" },
			{ start: "12:00", end: "12:50" },
		],
	},
	{
		value: "TARDE",
		label: "Tarde",
		minStart: 12 * 60 + 30,
		maxEnd: 18 * 60 + 20,
		slots: [
			{ start: "13:00", end: "13:50" },
			{ start: "13:50", end: "14:40" },
			{ start: "14:50", end: "15:40" },
			{ start: "15:40", end: "16:30" },
			{ start: "16:40", end: "17:30" },
			{ start: "17:30", end: "18:20" },
		],
	},
	{
		value: "NOITE",
		label: "Noite",
		minStart: 18 * 60 + 50,
		maxEnd: 22 * 60 + 50,
		slots: [
			{ start: "19:20", end: "20:10" },
			{ start: "20:10", end: "21:00" },
			{ start: "21:10", end: "22:00" },
			{ start: "22:00", end: "22:50" },
		],
	},
];

export const weekDays = [
	{ value: 1, label: "Segunda" },
	{ value: 2, label: "Terça" },
	{ value: 3, label: "Quarta" },
	{ value: 4, label: "Quinta" },
	{ value: 5, label: "Sexta" },
	{ value: 6, label: "Sábado" },
	{ value: 7, label: "Domingo" },
];

export const itemColors = [
	"var(--color-brand)",
	"var(--color-warn-fg)",
	"var(--color-brand-shade)",
	"var(--color-danger-fg)",
];

/** Converts an HH:mm time string to its equivalent minute count. */
export function timeInMinutes(time: string) {
	const [hours, minutes] = time.split(":").map(Number);
	return hours * 60 + minutes;
}

/** Maps a flexible lesson time to its nearest official blocks. */
export function getLessonBlocks(shift: Shift, lesson: GradeLessonPayload) {
	const start = timeInMinutes(lesson.horaInicio);
	const duration = timeInMinutes(lesson.horaFim) - start;
	if (!Number.isFinite(start) || !Number.isFinite(duration) || duration <= 0) {
		return [];
	}
	const blockCount = Math.ceil(duration / 50);
	let startIndex = -1;
	let shortestDistance = Number.POSITIVE_INFINITY;

	for (const [index, slot] of shift.slots.entries()) {
		const distance = Math.abs(timeInMinutes(slot.start) - start);
		if (distance <= shortestDistance) {
			startIndex = index;
			shortestDistance = distance;
		}
	}

	if (startIndex < 0 || startIndex + blockCount > shift.slots.length) return [];
	return Array.from({ length: blockCount }, (_, index) => startIndex + index);
}

/** Counts how many official 50-minute blocks an item currently occupies. */
export function getAllocatedBlocks(item: Grade) {
	const shift = shifts.find((entry) => entry.value === item.periodo);
	if (!shift) return 0;
	return item.aulas.reduce(
		(total, lesson) => total + getLessonBlocks(shift, lesson).length,
		0,
	);
}

/** Calculates the number of calendar months covered by an academic period. */
export function academicMonths(period: PeriodoLetivo) {
	if (!periodoDataValida(period)) return 6;
	const start = new Date(`${period.dataInicio}T00:00:00Z`);
	const end = new Date(`${period.dataFim}T00:00:00Z`);
	return Math.max(
		1,
		(end.getUTCFullYear() - start.getUTCFullYear()) * 12 +
			end.getUTCMonth() -
			start.getUTCMonth() +
			1,
	);
}

/** Checks that an academic period has valid start and end dates. */
export function periodoDataValida(periodo: PeriodoLetivo) {
	return Boolean(
		periodo.dataInicio &&
			periodo.dataFim &&
			!Number.isNaN(Date.parse(`${periodo.dataInicio}T00:00:00Z`)) &&
			!Number.isNaN(Date.parse(`${periodo.dataFim}T00:00:00Z`)),
	);
}

/** Rounds hour totals to two decimal places for persistence. */
export function roundHours(value: number) {
	return Math.round(value * 100) / 100;
}

/** Formats a decimal hour amount using Brazilian Portuguese conventions. */
export function formatHours(value: number) {
	return `${new Intl.NumberFormat("pt-BR", {
		minimumFractionDigits: 1,
		maximumFractionDigits: 1,
	}).format(value)}h`;
}

/** Calculates weekly, monthly, activity, and semester totals for one item. */
export function getItemsTotals(item: Grade, months: number) {
	const weekly = (item.quantidadeAulas * 50) / 60;
	const monthly = weekly * 4;
	const activity = monthly * 0.5;
	const monthlyTotal = monthly + activity;

	return {
		weekly,
		monthly,
		activity,
		monthlyTotal,
		semester: monthlyTotal * months,
	};
}
