const folhaPontoAPIRoutes = {
	PREVIEW: {
		method: "POST",
		path: ["folhas-ponto", "preview"],
	},

	GENERATE: {
		method: "POST",
		path: ["folhas-ponto", "gerar"],
		responseType: "blob" as const, // a API devolve o arquivo .docx
	},
};

export default folhaPontoAPIRoutes;