const disciplinaAPIRoutes = {
	GET_ALL: {
		method: "GET",
		path: ["disciplinas"],
		credentials: undefined //required
	},

	GET_BY_ID: {
		method: "GET",
		path: ["disciplinas", ":id"],
		credentials: undefined //required
	},

	SAVE: {
		method: "POST",
		path: ["disciplinas"],
		body: undefined, //required
		credentials: undefined, //required
	},

	EDIT: {
		method: "PUT",
		path: ["disciplinas", ":id"],
		body: undefined, //required
		credentials: undefined, //required
	},
    
    /*
    DELETE: {
		method: "DELETE",
		path: ["disciplinas", ":id"],
		body: undefined, //required
		credentials: undefined, //required
	},
    */

};

export default disciplinaAPIRoutes
