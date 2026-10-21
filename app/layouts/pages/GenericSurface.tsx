type GenericSurfaceProps = {
	children?: any;
	header?: any;
	options?: GenericSurfaceOptions;
	className?: string;
};

export type GenericSurfaceOptions = {
	withoutSpacing?: boolean;
};

export default function GenericSurface({
	children,
	header,
	options,
	className,
}: GenericSurfaceProps) {
	// const genericHeaderClass = `floor-accent rounded-b-none border-0 border-b flex flex-col ${!options?.withoutSpacing && "px-4 py-3"}`;
	// const genericClass = `flex flex-col ${!options?.withoutSpacing && "p-5"}`;
	const headerChildren = header && (
		<div className={`surface-accent rounded-b-none border-0 border-b`}>
			{header}
		</div>
	);

	return (
		<div className="surface flex flex-col">
			{headerChildren}
			<div className={className}>{children}</div>
		</div>
	);
}
