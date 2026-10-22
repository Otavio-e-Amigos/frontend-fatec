/** Símbolo do Appointer, na cor de marca. */
export default function BrandMark({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 40 40"
			fill="none"
			aria-hidden="true"
		>
			<circle cx="20" cy="20" r="7" fill="currentColor" />
			<circle cx="20" cy="6" r="5" fill="currentColor" />
			<circle cx="20" cy="34" r="5" fill="currentColor" />
			<circle cx="6" cy="20" r="5" fill="#555" />
			<circle cx="34" cy="20" r="5" fill="#555" />
		</svg>
	);
}