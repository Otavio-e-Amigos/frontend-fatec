import type { AulaSlot } from "~/modules/folha-ponto/folha-ponto.class";

export const MESES = [
	"Janeiro",
	"Fevereiro",
	"Março",
	"Abril",
	"Maio",
	"Junho",
	"Julho",
	"Agosto",
	"Setembro",
	"Outubro",
	"Novembro",
	"Dezembro",
];

/** Dias exibidos na grade horária (segunda a sábado, como no modelo oficial). */
export const WEEKDAYS = [
	{ value: 1, label: "Seg" },
	{ value: 2, label: "Ter" },
	{ value: 3, label: "Qua" },
	{ value: 4, label: "Qui" },
	{ value: 5, label: "Sex" },
	{ value: 6, label: "Sáb" },
];

/** Turnos e horários de início de cada slot, espelhando o modelo oficial (.docx). */
export const SHIFTS = [
	{
		turno: "MANHA",
		label: "Manhã",
		starts: ["7h30", "8h20", "9h20", "10h10", "11h10", "12h00"],
	},
	{
		turno: "TARDE",
		label: "Tarde",
		starts: ["13h00", "13h50", "14h50", "15h40", "16h40", "17h30"],
	},
	{
		turno: "NOITE",
		label: "Noite",
		starts: ["19h20", "20h10", "21h10", "22h00"],
	},
];

/** Colunas "em branco" da tabela de frequência: (assinatura + slots) de cada turno. */
export const FREQUENCY_COLUMNS = SHIFTS.reduce(
	(total, shift) => total + 1 + shift.starts.length,
	0,
);

export function cellKey(day: number, turno: string, slot: number) {
	return `${day}-${turno}-${slot}`;
}

/** Indexa as siglas por dia/turno/slot para preencher a grade horária. */
export function buildScheduleCells(slots: AulaSlot[]) {
	const cells = new Map<string, string>();
	for (const item of slots) {
		const key = cellKey(item.diaSemana, item.turno, item.slot);
		const current = cells.get(key);
		cells.set(key, current ? `${current} / ${item.sigla}` : item.sigla);
	}
	return cells;
}