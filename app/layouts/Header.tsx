import { useEffect, useState } from "react";
import { Link } from "react-router";
import AuthService from "~/modules/user/auth.service";
import User from "~/modules/user/user.class";
import BrandMark from "./BrandMark";

const staticLinks = [
	// {label: "Página inicial", href: "/"},
	// {label: "Grades", href: "/"},
	// {label: "Login", href: "/login"},
	{ label: "Gestão", href: "/system" },
	{ label: "Grade", href: "/grade" },
	{
		label: "Professores",
		href: "/professor",
		items: [{ label: "Gerenciar Professores" }, { label: "Gerenciar Cursos" }],
	},
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
	// return <Link to={href} className={`py-1 px-2 rounded-lg ${active ? "bg-item-button hover:bg-indigo-700" : "bg-indigo-500/20 hover:bg-indigo-500/50"}`}>{label}</Link>
	return (
		<Link to={href} className={`header-link`}>
			{label}
		</Link>
	);
}

const nonLoggedUser = new User({
	id: 0,
	name: "Não logado",
	password: "123456",
});

function UserLink({ user }: { user?: User }) {
	const [hover, setHover] = useState(false);

	const hoverStates = {
		onMouseOver: () => {
			setHover(true);
		},
		onMouseOut: () => {
			setHover(false);
		},
	};

	return (
		<div className="flex flex-col h-full mx-2">
			<div
				{...hoverStates}
				// className={ `${hover && "bg-brand-hover"} header-link h-full px-2`}
				// className={`${hover && "header-link"} header-link h-full px-2`}
				className={`header-link ${hover && "bg-white/20"} rounded-none h-full px-2`}
			>
				<p className="h-full flex items-center">{user?.name}</p>
			</div>
			{hover && (
				<div
					{...hoverStates}
					className="fixed w-full bg-brand translate-y-12 rounded-b-lg"
				>
					<Link to={"/login"}>
						<p className="header-link rounded-t-none w-full h-full p-2">
							Login
						</p>
					</Link>
				</div>
			)}
		</div>
	);
}

export default function Header({ activeItem }: { activeItem?: string }) {
	const [currentUser, setCurrentUser] = useState(nonLoggedUser);

	useEffect(() => {
		setCurrentUser(
			AuthService.hasUserToken() ? AuthService.getUserToken() : nonLoggedUser,
		);
	}, []);

	return (
		<div className="flex flex-col">
			<div className="header flex flex-row">
				<header className="flex flex-col px-3 py-1">
					<div className="flex flex-row gap-10 items-center">
						<Link to={"/"}>
							<div className="flex flex-row gap-2 items-center  bg-brand-soft/50 rounded-lg hover:bg-brand-soft/75 px-1.5">
								<BrandMark />
								<p>Appointer</p>
							</div>
						</Link>

						<nav className="flex flex-row gap-2 items-center">
							{staticLinks.map(({ label, href }, idx) => (
								<HeaderLink
									key={idx}
									label={label}
									href={href}
									active={label === activeItem ? true : false}
								/>
							))}
							{process.env.NODE_ENV === "development" && (
								<Link to={"/dev-area"} className="header-link">
									dev-area
								</Link>
							)}
						</nav>
					</div>
				</header>
				<nav className="flex flex-1 justify-end items-center gap-2">
					{/*<HeaderLink label="Login" href="/login" active={false} />*/}
					<UserLink user={currentUser} />
					{/*<p className="text-amber-400">Não logado</p>*/}
				</nav>
			</div>
			<div className="min-h-3 bg-header-bg-shade w-42 -skew-x-25 -translate-x-4" />
		</div>
	);
}
