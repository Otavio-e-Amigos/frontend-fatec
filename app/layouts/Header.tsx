import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import BrandMark from "~/components/BrandMark";
import NotificacoesSino from "./NotificacoesSino";
import AuthService from "~/modules/user/auth.service";
import User from "~/modules/user/user.class";
import { HomeUser, UserBag, UserCircle } from "iconoir-react";

const staticLinks = [
	{ label: "Gestão", href: "/system", allowed: ["TI"] },
	{ label: "Grade", href: "/grade" },
	{ label: "Professores", href: "/professor" },
	{ label: "Disciplinas", href: "/disciplina" },
	{ label: "Cursos", href: "/curso" },
	{ label: "Períodos", href: "/periodo-letivo" },
	{ label: "Folha de Ponto", href: "/folha-ponto" },
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
					: "text-text-muted hover:bg-brand-soft hover:text-brand-hover"
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
	profile: "RESPONSAVEL",
});

export function HeaderBrand({ noRedirect }: { noRedirect?: boolean }) {
	const content = (
		<div className="flex items-center gap-2 text-ink">
			<BrandMark className="size-9 text-brand" />
			<span className="flex flex-col leading-none">
				<strong className="text-base font-bold">Appointer</strong>
			</span>
		</div>
	);
	return (
		<div className="flex flex-1 basis-0 items-center">
			{noRedirect && content}

			{!noRedirect && (
				<Link
					to="/"
					aria-label="Appointer - início"
					className="flex items-center gap-2 text-ink"
				>
					{content}
				</Link>
			)}
		</div>
	);
}

export default function Header({ activeItem }: { activeItem?: string }) {
	const [currentUser, setCurrentUser] = useState(nonLoggedUser);
	const { pathname } = useLocation();
	const [userHovered, setUserHovered] = useState(false);

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
		<header className="sticky top-0 z-10 bg-white shadow-card">
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
					{staticLinks.map(({ label, href, allowed }) => {
						if (
							allowed &&
							!allowed.includes(String(currentUser.profile ?? "").toUpperCase())
						) {
							return;
						}
						return (
							<HeaderLink
								key={href}
								label={label}
								href={href}
								active={isActive(label, href)}
							/>
						);
					})}
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


					{isLogged && <NotificacoesSino />}

					{isLogged ? (
						<div
							onMouseOver={() => setUserHovered(true)}
							onMouseOut={() => setUserHovered(false)}
						>
							<div
								className="flex flex-col h-8 gap-2 hover:bg-slate-800/10 rounded-card px-2"
								onMouseOver={() => setUserHovered(true)}
								onMouseOut={() => setUserHovered(false)}
							>
								<div className="flex flex-row gap-2 items-center h-8">
									<UserCircle />
									<p className="text-sm font-medium text-ink">
										{currentUser.name}
									</p>
								</div>

								{userHovered && (
									<div className="bg-white fixed top-11 right-3 w-40 rounded-card">
										<div className="p-2">
											<Link
												to="/login"
												className="link inline-flex h-8 items-center text-sm"
											>
												Login
											</Link>
										</div>
										<div aria-hidden className="h-0.75 bg-brand/45" />
										</div>
								)}
							</div>
						</div>
					) : (
							<div className="flex flex-row gap-2">
								<Link
									to="/login"
									className="link inline-flex h-8 items-center text-sm"
								>
									Login
								</Link>
								<p className="text-sm text-amber-700">Não logado</p>
							</div>
					)}
				</div>
			</div>

			{/* Faixa vermelha translúcida com brilho */}
			<div aria-hidden className="h-0.75 bg-brand/45" />
		</header>
	);
}
