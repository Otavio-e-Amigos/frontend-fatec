import { Link } from "react-router";
import type { HomeShortcut } from "~/pages/home-shortcuts";

// Bloco exibido enquanto o atalho não tiver `image` em home-shortcuts.ts
function ImagePlaceholder() {
	return (
		<div
			className="surface-accent flex aspect-square w-full items-center justify-center rounded-none border-0 border-b text-ink-faint"
			aria-hidden
		>
			<svg
				width="40"
				height="40"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<rect x="3" y="4" width="18" height="16" rx="2" />
				<circle cx="9" cy="10" r="1.5" />
				<path d="m21 16-5-5-8 8" />
			</svg>
		</div>
	);
}

// Camada "surface": card em retângulo vertical, dentro do painel "floor"
export default function ShortcutCard({
	title,
	description,
	href,
	image,
	profiles,
}: HomeShortcut) {
	return (
		<article className="surface relative flex h-full flex-col overflow-hidden transition-shadow hover:shadow-card-hover">
			{/* Gancho de imagens: placeholder até o atalho definir `image` */}
			{image ? (
				<img
					src={image}
					alt=""
					loading="lazy"
					className="aspect-square w-full border-b border-page-surface-outline object-cover"
				/>
			) : (
				<ImagePlaceholder />
			)}

			<div className="flex flex-1 flex-col items-center justify-center gap-1.5 px-3 py-4 text-center">
				{/* O after: estica a área clicável para o card inteiro */}
				<Link
					to={href}
					title={description}
					className="link text-base font-semibold after:absolute after:inset-0 focus-visible:after:outline-2 focus-visible:after:outline-brand"
				>
					{title}
				</Link>
				{profiles && <span className="chip">{profiles.join(" / ")}</span>}
			</div>
		</article>
	);
}