export default function FloorHeader({
	title,
	description,
	className,
}: {
	title: string;
		description?: string;
	className?: string
}) {
	return (
		<div className={`flex flex-col ${className}`}>
			<h1 className="text-xl font-bold text-red-950">{title}</h1>
			<p className="text-xs text-brand-shade">{description}</p>
		</div>
	);
}
