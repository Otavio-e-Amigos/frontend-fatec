const turnoLabels: Record<string, string> = {
	MANHA: "Manhã",
	TARDE: "Tarde",
	NOITE: "Noite",
};

export default function formatTurno(turno?: string) {
	if (!turno) return "";

	const normalized = turno
		.trim()
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "")
		.toUpperCase();

	return turnoLabels[normalized] ?? turno;
}
