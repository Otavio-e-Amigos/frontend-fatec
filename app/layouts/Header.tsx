import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import BrandMark from "~/components/BrandMark";
import AuthService from "~/modules/user/auth.service";
import User from "~/modules/user/user.class";

const staticLinks = [
	{ label: "Gestão", href: "/system" },
	{ label: "Grade", href: "/grade" },
	{ label: "Professores", href: "/professor" },
	{ label: "Disciplinas", href: "/disciplina" },
	{ label: "Cursos", href: "/curso" },
	{ label: "Períodos", href: "/periodo-letivo" },
];

function HeaderLink({
	label,
	href,
	active,
}: {
	label: string;
	href: string;
	active?: boolean;
}) {
	return (
		<Link
			to={href}
			aria-current={active ? "page" : undefined}
			className={`inline-flex h-8 items-center rounded-control px-2.5 text-sm font-medium transition-colors ${
				active
					? "bg-brand-soft text-brand"
					: "text-ink-muted hover:bg-brand-soft hover:text-brand"
			}`}
		>
			{label}
		</Link>
	);
}

const nonLoggedUser = new User({
	id: 0,
	name: "Não logado",
	password: "123456",
});

export default function Header({ activeItem }: { activeItem?: string }) {
	const [currentUser, setCurrentUser] = useState(nonLoggedUser);
	const { pathname } = useLocation();

	useEffect(() => {
		setCurrentUser(
			AuthService.hasUserToken() ? AuthService.getUserToken() : nonLoggedUser,
		);
	}, []);

	const isLogged = currentUser !== nonLoggedUser;

	// O item é ativo pelo activeItem das páginas ou pela própria URL.
	const isActive = (label: string, href: string) =>
		label === activeItem ||
		pathname === href ||
		pathname.startsWith(`${href}/`);

	return (
		// relative + z-10: o brilho da faixa vermelha aparece por cima do conteúdo abaixo
		<header className="relative z-10 bg-surface shadow-card">
			<div className="flex min-h-14 flex-wrap items-center gap-x-6 gap-y-2 px-5 py-2">
				{/* Esquerda: marca (flex-1 para equilibrar com o lado direito) */}
				<div className="flex flex-1 basis-0 items-center">
					<Link
						to="/"
						aria-label="Appointer - início"
						className="flex items-center gap-2 text-ink"
					>
						<BrandMark className="size-9 text-brand" />
						<span className="flex flex-col leading-none">
							<strong className="text-base font-bold">Appointer</strong>
						</span>
					</Link>
				</div>

				{/* Centro: navegação */}
				<nav className="flex flex-wrap items-center justify-center gap-1">
					{staticLinks.map(({ label, href }) => (
						<HeaderLink
							key={href}
							label={label}
							href={href}
							active={isActive(label, href)}
						/>
					))}
					{process.env.NODE_ENV === "development" && (
						<HeaderLink
							label="dev-area"
							href="/dev-area"
							active={pathname.startsWith("/dev-area")}
						/>
					)}
				</nav>

				{/* Direita: usuário */}
				<div className="flex flex-1 basis-0 items-center justify-end gap-4">
					<Link to="/login" className="link inline-flex h-8 items-center text-sm">
						Login
					</Link>

					{isLogged ? (
						<div className="flex h-8 items-center gap-2">
							<p className="text-sm font-medium text-ink">{currentUser.name}</p>
						</div>
					) : (
						<p className="text-sm text-amber-700">Não logado</p>
					)}
				</div>
			</div>

			{/* Faixa vermelha translúcida com brilho */}
			<div
				aria-hidden
				className="h-[3px] bg-brand/45"
			/>
		</header>
	);
}
