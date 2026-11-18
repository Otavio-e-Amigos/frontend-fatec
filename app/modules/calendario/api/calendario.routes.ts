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

	// confirmação anual: o ano entra no caminho na hora da chamada
	STATUS_ATUALIZACAO: {
		method: "GET",
		path: ["calendario", "atualizacao", undefined],
		credentials: undefined, //required
	},

	CONFIRMAR_ATUALIZACAO: {
		method: "POST",
		path: ["calendario", "atualizacao", undefined, "confirmar"],
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
