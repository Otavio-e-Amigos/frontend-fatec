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
	// options,
	className,
}: GenericSurfaceProps) {
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
