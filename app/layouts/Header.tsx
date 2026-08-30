import { Link } from "react-router"

const links = [
  {label: "Página inicial", href: "/"},
  {label: "Grade", href: "/"},
  {label: "Professores", href: "/", items: [
    {label: "Gerenciar Professores"},
    {label: "Gerenciar Cursos"},
  ]},
]

export default function Header() {
  return (
    <header className="flex flex-col gap-3">
      <section>

      </section>
      <nav className="flex flex-row gap-2">
        {links.map(({ label, href }, idx) => { return <Link key={idx} to={href}>{ label }</Link>})}
      </nav>
    </header>
  )
}
