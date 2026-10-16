import { useEffect, useState } from "react";
import { Link } from "react-router";
import AuthService from "~/modules/user/auth.service";
import User from "~/modules/user/user.class";

const staticLinks = [
  // {label: "Página inicial", href: "/"},
  // {label: "Grades", href: "/"},
  // {label: "Login", href: "/login"},
  {label: "Gestão", href: "/system"},
  {label: "Grade", href: "/grade"},
  {label: "Professores", href: "/professor", items: [
    {label: "Gerenciar Professores"},
    {label: "Gerenciar Cursos"},
  ]},
  {label: "Disciplinas", href: "/disciplina"},
  {label: "Cursos", href: "/curso"},
  {label: "Períodos", href: "/periodo-letivo"},
]

function HeaderLink({label, href, active}: {label:string, href:string, active?:boolean}) {
	// return <Link to={href} className={`py-1 px-2 rounded-lg ${active ? "bg-item-button hover:bg-indigo-700" : "bg-indigo-500/20 hover:bg-indigo-500/50"}`}>{label}</Link>
	return <Link to={href} className={`header-link`}>{label}</Link>
}

const nonLoggedUser = new User({
  id: 0,
  name: "Não logado",
  password: "123456",
})

export default function Header({ activeItem }: { activeItem?: string }) {
	const [currentUser, setCurrentUser] = useState(nonLoggedUser);

	useEffect(() => {
		setCurrentUser(
			AuthService.hasUserToken() ? AuthService.getUserToken() : nonLoggedUser,
		);
	}, []);

	return (
		<>
			<header className="header flex flex-col px-3 py-1">
				<div className="flex flex-row gap-10 items-center">

					<div className="flex flex-row gap-2 items-center">
						<img src="/favicon.ico" className="size-10"/>
						<Link to={"/"}>Appointer</Link>
					</div>

		      <nav className="flex flex-row gap-2 items-center">
						{staticLinks.map(({ label, href }, idx) => <HeaderLink key={idx} label={label} href={href} active={label === activeItem ? true : false} /> )}
						{process.env.NODE_ENV === 'development' && <Link to={"/dev-area"} className="header-link">dev-area</Link>}
					</nav>

					<nav className="flex flex-1 justify-end items-center gap-2">
						<HeaderLink label="Login" href="/login" active={false} />
						{currentUser ? <p>{currentUser.name}</p> : <p className="text-amber-400">Não logado</p>}
					</nav>
				</div>
	    </header>
			<div className="min-h-3 bg-header-bg-shade w-42 -skew-x-25 -translate-x-4"/>
		</>
  )
}
