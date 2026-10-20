type GenericFloorProps = {
	children?: any;
	header?: any;
	options?: GenericFloorOptions;
	className?: string;
};

export type GenericFloorOptions = {
	withoutSpacing?: boolean;
};

export default function GenericFloor({
	children,
	header,
	options,
	className,
}: GenericFloorProps) {
	// const genericHeaderClass = `floor-accent rounded-b-none border-0 border-b flex flex-col ${!options?.withoutSpacing && "px-4 py-3"}`;
	// const genericClass = `flex flex-col ${!options?.withoutSpacing && "p-5"}`;
	const headerChildren = header && (
		<div className={`floor-accent rounded-b-none border-0 border-b`}>
			{header}
		</div>
	);

	return (
		<div className="floor flex flex-col">
			{headerChildren}
			<div className={className}>{children}</div>
		</div>
	);
}
