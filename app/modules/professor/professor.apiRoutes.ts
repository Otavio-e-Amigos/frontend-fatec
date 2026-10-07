// import type AbstractQueryObject from "../api/base/AbstractQueryObject";


// REFLECT i think i wrote this somewhere else, but does it sounds interesting if i convert those routes or the Query object into a class with more complex and dynamic functions?
// TODO add mock data attributes for testing
// const professorAPIRoutes: Record< string, AbstractQueryObject> = {
const professorAPIRoutes = {
	GET_ALL: {
		method: "GET",
		path: ["professores"],
		credentials: undefined //required
	},

	GET_BY_ID: {
		method: "GET",
		path: ["professores", ":id"],
		credentials: undefined //required
	},

	SAVE: {
		method: "POST",
		path: ["professores"],
		body: undefined, //required
		credentials: undefined, //required
	},

	EDIT: {
		method: "PUT",
		path: ["professores", ":id"],
		body: undefined, //required
		credentials: undefined, //required
	},

	ACTIVATE: {
		method: "PATCH",
		path: ["professores", ":id", "status"],
		credentials: undefined, //required
		body: { status: "ATIVO" }
	},

	DEACTIVATE: {
		method: "PATCH",
		path: ["professores", ":id", "status"],
		credentials: undefined, //required
		body: { status: "INATIVO" }
	},
};

export default professorAPIRoutes
