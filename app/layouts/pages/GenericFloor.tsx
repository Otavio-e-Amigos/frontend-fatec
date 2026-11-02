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
	// options,
	className,
}: GenericFloorProps) {
	const headerChildren = header && (
		<div className={`floor-accent rounded-b-none border-0 border-b`}>
			{header}
		</div>
	);

	return (
		<div className="floor flex flex-col" onClick={(e) => e.stopPropagation()}>
			{headerChildren}
			<div className={className}>{children}</div>
		</div>
	);
}
