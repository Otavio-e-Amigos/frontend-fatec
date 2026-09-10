import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),

	route("dev-area", 'routes/dev-area/router.outlet.tsx', [
		index('routes/dev-area/index.tsx')
	])

] satisfies RouteConfig;
