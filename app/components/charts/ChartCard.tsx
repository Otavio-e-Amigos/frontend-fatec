import type { ReactNode } from "react";

/** Moldura de um gráfico: título, descrição e aviso quando não há dados. */
export default function ChartCard({
	title,
	description,
	empty,
	emptyMessage = "Sem dados no período.",
	children,
}: {
	title: string;
	description?: string;
	empty?: boolean;
	emptyMessage?: string;
	children: ReactNode;
}) {
	return (
		<section className="flex flex-col gap-2 rounded-control border border-line p-3">
			<div>
				<h3 className="text-sm font-semibold text-ink">{title}</h3>
				{description && <p className="text-[11px] text-ink-muted">{description}</p>}
			</div>
			{empty ? (
				<p className="py-8 text-center text-sm text-ink-muted">{emptyMessage}</p>
			) : (
				children
			)}
		</section>
	);
}
