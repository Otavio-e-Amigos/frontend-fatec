const cursoAPIRoutes = {
	GET_ALL: {
		method: "GET",
		path: ["cursos"],
		credentials: undefined //required
	},

	GET_BY_ID: {
		method: "GET",
		path: ["cursos", ":id"],
		credentials: undefined //required
	},

	SAVE: {
		method: "POST",
		path: ["cursos"],
		body: undefined, //required
		credentials: undefined, //required
	},

	EDIT: {
		method: "PUT",
		path: ["cursos", ":id"],
		body: undefined, //required
		credentials: undefined, //required
	},

};

export default cursoAPIRoutes
