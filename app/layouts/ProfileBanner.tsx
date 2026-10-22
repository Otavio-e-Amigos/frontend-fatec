import type { ReactNode } from "react";
import BrandMark from "~/components/BrandMark";

type ProfileBannerProps = {
	/** Imagem de fundo. Sem ela, mostra o degradê da marca. */
	image?: string;
	alt?: string;
	/** Conteúdo opcional sobre o banner (ex.: um título). */
	children?: ReactNode;
	className?: string;
};

export default function ProfileBanner({
	image,
	alt = "",
	children,
	className = "",
}: ProfileBannerProps) {
	return (
		<section
			className={`relative isolate h-36 overflow-hidden sm:h-44 ${className}`}
			style={{
				backgroundImage:
					"linear-gradient(135deg, var(--color-brand-shade), var(--color-brand))",
			}}
		>
			{image ? (
				<>
					<img
						src={image}
						alt={alt}
						className="absolute inset-0 -z-10 h-full w-full object-cover"
					/>
					{/* Escurece levemente para o conteúdo sobre a imagem continuar legível */}
					<div aria-hidden className="absolute inset-0 -z-10 bg-black/25" />
				</>
			) : (
				<BrandMark className="absolute -right-6 -top-6 -z-10 size-56 text-white opacity-10" />
			)}

			{children && (
				<div className="relative flex h-full items-end p-5 text-white">
					{children}
				</div>
			)}
		</section>
	);
}