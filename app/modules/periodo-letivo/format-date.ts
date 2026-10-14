export default function formatPeriodoDate(date?: string) {
	if (!date) return "";

	const [year, month, day] = date.slice(0, 10).split("-");
	if (!year || !month || !day) return date;

	const parsedDate = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
	if (
		Number.isNaN(parsedDate.getTime()) ||
		parsedDate.getUTCFullYear() !== Number(year) ||
		parsedDate.getUTCMonth() !== Number(month) - 1 ||
		parsedDate.getUTCDate() !== Number(day)
	) {
		return date;
	}

	return `${day}/${month}/${year}`;
}
