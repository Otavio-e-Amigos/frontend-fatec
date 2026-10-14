const cursoAPIRoutes = {
	GET_ALL: {
		method: "GET",
		path: ["cursos"],
	},

	GET_BY_ID: {
		method: "GET",
		path: ["cursos", ":id"],
	},

	SAVE: {
		method: "POST",
		path: ["cursos"],
	},

	EDIT: {
		method: "PUT",
		path: ["cursos", ":id"],
	},
};

export default cursoAPIRoutes;
