import { Link } from "react-router"
import type { Route } from "./+types/[id]"
import About from "~/pages/professor/[id]"



export async function clientLoader({ params }: Route.LoaderArgs) {
  const id = params.id
  return {id}
}

export default function Page({ loaderData }: Route.ComponentProps) {
	return (
		<About />
  )
}
