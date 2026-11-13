const calendarioAPIRoutes = {
	GET_ALL: {
		method: "GET",
		path: ["calendario"],
		credentials: undefined, //required
	},

	SAVE: {
		method: "POST",
		path: ["calendario"],
		body: undefined,
		credentials: undefined, //required
	},

	// o identificador é a própria data (YYYY-MM-DD)
	UPDATE: {
		method: "PUT",
		path: ["calendario", undefined],
		body: undefined,
		credentials: undefined, //required
	},

	DELETE: {
		method: "DELETE",
		path: ["calendario", undefined],
		credentials: undefined, //required
	},
};

export default calendarioAPIRoutes;
