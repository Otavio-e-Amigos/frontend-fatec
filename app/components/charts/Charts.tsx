import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	LabelList,
	Line,
	LineChart,
	Pie,
	PieChart,
	Sector,
	Tooltip,
	XAxis,
	YAxis,
	type PieSectorShapeProps,
} from "recharts";

/** Ponto de dado dos gráficos: um rótulo e um número. */
export type ChartPoint = { name: string; value: number };

/** Cores do tema (`--color-chart-N`, em styles/themes/*.theme.css). */
export const CHART_COLORS = Array.from(
	{ length: 10 },
	(_, index) => `var(--color-chart-${index + 1})`,
);

const GRID = "var(--color-page-line)";
const AXIS_TICK = { fontSize: 11, fill: "var(--color-text-muted)" };
const DEFAULT_HEIGHT = 260;

/** Barras verticais com o valor em cima de cada barra. */
export function BarraSimples({
	data,
	label = "Quantidade",
	height = DEFAULT_HEIGHT,
}: {
	data: ChartPoint[];
	label?: string;
	height?: number;
}) {
	return (
		<BarChart
			data={data}
			responsive
			style={{ width: "100%", height }}
			margin={{ top: 20, right: 8, left: 0, bottom: 0 }}
		>
			<CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={false} />
			<XAxis dataKey="name" tick={AXIS_TICK} interval={0} />
			<YAxis allowDecimals={false} width={32} tick={AXIS_TICK} />
			<Tooltip cursor={{ fill: "var(--color-brand-soft)" }} />
			<Bar dataKey="value" name={label} fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]}>
				<LabelList dataKey="value" position="top" fontSize={11} />
			</Bar>
		</BarChart>
	);
}

/** Linha para acompanhar a evolução ao longo do tempo. */
export function LinhaSimples({
	data,
	label = "Quantidade",
	height = DEFAULT_HEIGHT,
}: {
	data: ChartPoint[];
	label?: string;
	height?: number;
}) {
	return (
		<LineChart
			data={data}
			responsive
			style={{ width: "100%", height }}
			margin={{ top: 12, right: 12, left: 0, bottom: 0 }}
		>
			<CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={false} />
			<XAxis dataKey="name" tick={AXIS_TICK} minTickGap={16} />
			<YAxis allowDecimals={false} width={32} tick={AXIS_TICK} />
			<Tooltip />
			<Line
				type="monotone"
				dataKey="value"
				name={label}
				stroke={CHART_COLORS[0]}
				strokeWidth={2}
				dot={{ r: 3 }}
				activeDot={{ r: 5 }}
			/>
		</LineChart>
	);
}

/** Pizza com legenda: boa para mostrar proporções de um todo (ex.: sucesso x falha). */
export function PizzaSimples({
	data,
	colors = CHART_COLORS,
	height = DEFAULT_HEIGHT,
}: {
	data: ChartPoint[];
	colors?: string[];
	height?: number;
}) {
	const shape = (props: PieSectorShapeProps) => (
		<Sector {...props} fill={colors[props.index % colors.length]} />
	);

	return (
		<PieChart responsive style={{ width: "100%", height }}>
			<Pie data={data} dataKey="value" nameKey="name" shape={shape} outerRadius="80%">
				<LabelList dataKey="value" position="inside" fill="white" fontSize={12} />
			</Pie>
			<Tooltip />
			<Legend verticalAlign="bottom" iconType="circle" />
		</PieChart>
	);
}
