import type AbstractQueryObject from "~/modules/api/base/AbstractQueryObject";

const periodosLetivosAPIRoutes = {
	GET_ALL: {
		method: "GET",
		path: ["periodos-letivos"],
		credentials: undefined, //required
	},

	GET_BY_ID: {
		method: "GET",
		path: ["periodos-letivos", ":id"],
		credentials: undefined, //required
	},

	SAVE: {
		method: "POST",
		path: ["periodos-letivos"],
		body: undefined, //This body structure would need runtime population
		credentials: undefined, //required
	},
};

export default periodosLetivosAPIRoutes
