const base = ["usuarios"]
const baseId = [...base, ":id"]

const userAPIRoutes = {
	GET_ALL: {
		method: "GET",
		path: base,
		credentials: undefined //required
	},

	GET_BY_ID: {
		method: "GET",
		path: baseId,
		credentials: undefined //required
	},

	SAVE: {
		method: "POST",
		path: base,
		body: undefined, //required
		credentials: undefined, //required
	},

	EDIT: {
		method: "PUT",
		path: baseId,
		body: undefined, //required
		credentials: undefined, //required
	},

	ACTIVATE: {
		method: "PATCH",
		path: [...baseId, "ativar"],
		credentials: undefined, //required
	},

	DEACTIVATE: {
		method: "PATCH",
		path: [...baseId, "desativar"],
		credentials: undefined, //required
	},
};

export default userAPIRoutes
