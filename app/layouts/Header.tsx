import { Link } from "react-router"

const links = [
  // {label: "Página inicial", href: "/"},
  {label: "Grades", href: "/"},
  {label: "Professores", href: "/professor", items: [
    {label: "Gerenciar Professores"},
    {label: "Gerenciar Cursos"},
  ]},
]

function HeaderLink({label, href, active}: {label:string, href:string, active?:boolean}) {
	// return <Link to={href} className={`py-1 px-2 rounded-lg ${active ? "bg-item-button hover:bg-indigo-700" : "bg-indigo-500/20 hover:bg-indigo-500/50"}`}>{label}</Link>
	return <Link to={href} className={`header-link`}>{label}</Link>
}

export default function Header({activeItem}: {activeItem?: string}) {
	return (
		<>
			<header className="header flex flex-col px-3 py-1">
				<div className="flex flex-row gap-10 items-center">

					<div className="flex flex-row gap-2 items-center">
						<img src="/favicon.ico" className="size-10"/>
						<Link to={"/"}>Appointer</Link>
					</div>

		      <nav className="flex flex-row gap-2 items-center">
						{links.map(({ label, href }, idx) => <HeaderLink key={idx} label={label} href={href} active={label === activeItem ? true : false} /> )}
						{process.env.NODE_ENV === 'development' && <Link to={"/dev-area"} className="header-link">dev-area</Link>}
		      </nav>
				</div>
	    </header>
			<div className="min-h-3 bg-header-bg-shade w-42 -skew-x-25 -translate-x-4"/>
		</>
  )
}
