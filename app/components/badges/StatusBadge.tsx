type BadgeColors = "green" | "yellow" | "red" | "gray";
const badgeColorsChart: Record<BadgeColors, string> = {
	green: "bg-hint-success border-green-900/30",
	yellow: "bg-hint-progress border-orange-800/30",
	red: "bg-hint-warning border-rose-900/70",
	gray: "bg-hint-unknown border-gray-900/30",
};

export default function StatusBadge({
	value,
	status,
	fill,
}: {
	value: string;
	status: BadgeColors;
	fill?: boolean;
}) {
	return (
		<div className={`flex flex-row gap-2 items-center w-fit ${fill && `${badgeColorsChart[status]} border-3 rounded-lg px-2 py-0.5`}`}>
			<span
				className={`min-w-3 min-h-3 rounded-2xl border-2 ${badgeColorsChart[status]}`}
			/>
			<p>{value}</p>
		</div>
	);
}
