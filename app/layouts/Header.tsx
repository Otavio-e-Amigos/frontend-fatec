import { Link } from "react-router"

const links = [
  {label: "Página inicial", href: "/"},
  {label: "Página inicial", href: "/"},
  {label: "Página inicial", href: "/"},
  {label: "Página inicial", href: "/"},
]

export default function Header() {
  return (
    <header className="flex flex-col gap-3">
      <section>

      </section>
      <nav className="flex flex-row gap-2">
        {links.map(({ label, href }) => { return <Link to={href}>{ label }</Link>})}
      </nav>
    </header>
  )
}
