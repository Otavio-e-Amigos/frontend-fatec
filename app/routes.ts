import { type RouteConfig, index, route } from "@react-router/dev/routes";

// REFLECT i believe there is a way of reducing or optimize this part using dynamic helper functions for each part of the website
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

	
	route("curso", "routes/curso/router.outlet.tsx", [
		index("routes/curso/index.tsx"),
		route(":id", "routes/curso/[id]/router.outlet.tsx", [
			index("routes/curso/[id]/[id].tsx"),
			route("edit", "routes/curso/edit.tsx"),
		]),
		route("add", "routes/curso/add.tsx"),
	]),

	route("disciplina", "routes/disciplina/router.outlet.tsx", [
		index("routes/disciplina/index.tsx"),
		route(":id", "routes/disciplina/[id]/router.outlet.tsx", [
			index("routes/disciplina/[id]/[id].tsx"),
			route("edit", "routes/disciplina/edit.tsx"),
		]),
		route("add", "routes/disciplina/add.tsx"),
	]),

] satisfies RouteConfig;
