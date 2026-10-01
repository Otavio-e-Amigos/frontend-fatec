import { Outlet } from "react-router";
import type { Route } from './+types/router.outlet'

export default function RouterOutlet({ loaderData }: Route.ComponentProps) {
  return (<>
    <Outlet/>
  </>)
}
