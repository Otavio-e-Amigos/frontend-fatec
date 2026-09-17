import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),

	route("dev-area", 'routes/dev-area/router.outlet.tsx', [
		index('routes/dev-area/index.tsx')
	]),

	route("professor", 'routes/professor/router.outlet.tsx', [
		index('routes/professor/index.tsx'),
		route(":id", "routes/professor/[id].tsx"),
		route("add", 'routes/professor/add.tsx')
	])

] satisfies RouteConfig;
