export default function ShadowCenter({
	children,
	onClick,
}: {
	children?: any;
	onClick?: (e?: any) => void;
}) {
	return (
		<div
			className="fixed inset-0 z-50 grid place-items-center bg-black/60"
			onClick={onClick}
		>
			{children}
		</div>
	);
}
