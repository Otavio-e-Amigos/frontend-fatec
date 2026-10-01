import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),

	route("login", "routes/login.tsx"),

	route("system", "routes/system/router.outlet.tsx", [
		index("routes/system/index.tsx"),
		route("user", "routes/system/user/router.outlet.tsx", [
			route("add", "routes/system/user/add.tsx"),
			route(":id", "routes/system/user/[id]/router.outlet.tsx", [
				// index("routes/system/user/[id]/[id].tsx"),
				route("edit", "routes/system/user/[id]/edit.tsx"),
			]),
		]),
	]),

	route("dev-area", "routes/dev-area/router.outlet.tsx", [
		index("routes/dev-area/index.tsx"),
	]),

	route("professor", "routes/professor/router.outlet.tsx", [
		index("routes/professor/index.tsx"),
		route(":id", "routes/professor/[id]/router.outlet.tsx", [
			index("routes/professor/[id]/[id].tsx"),
			route("edit", "routes/professor/edit.tsx"),
		]),
		route("add", "routes/professor/add.tsx"),
	]),
] satisfies RouteConfig;
