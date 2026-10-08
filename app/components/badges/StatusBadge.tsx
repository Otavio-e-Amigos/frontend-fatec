export type BadgeTone = "ok" | "warn" | "danger" | "neutral" | "solid";

// aceita o formato antigo (status="green") para não quebrar a dev-area
const legacyStatus = {
	green: "ok",
	yellow: "warn",
	red: "danger",
	gray: "neutral",
} as const;

function InfoIcon() {
	return (
		<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
			<path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm.75 10.5h-1.5V7h1.5v4.5ZM8 5.9a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8Z" />
		</svg>
	);
}

export default function StatusBadge({
	value,
	tone,
	status,
	tag,
	hint,
}: {
	value: string;
	tone?: BadgeTone;
	status?: keyof typeof legacyStatus;
	fill?: boolean; // ignorado: todo badge agora é preenchido
	tag?: boolean; // rótulo curto em caixa alta, sem ponto (READY, UNIQUE)
	hint?: string; // mostra um ícone ⓘ com este texto no tooltip
}) {
	const resolved = tone ?? (status ? legacyStatus[status] : "neutral");
	return (
		<span
			className="badge"
			data-tone={resolved}
			data-style={tag ? "tag" : undefined}
		>
			{value}
			{hint && (
				<span title={hint} className="inline-flex">
					<InfoIcon />
				</span>
			)}
		</span>
	);
}
