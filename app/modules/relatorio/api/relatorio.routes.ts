const relatorioAPIRoutes = {
	EXTRACOES_GRADE: {
		method: "GET",
		path: ["relatorios", "extracoes-grade"],
	},
	EXTRACOES_GRADE_EXPORTAR: {
		method: "GET",
		path: ["relatorios", "extracoes-grade", "exportar"],
		responseType: "blob" as const,
	},
	FOLHAS_PONTO: {
		method: "GET",
		path: ["relatorios", "folhas-ponto"],
	},
	FOLHAS_PONTO_EXPORTAR: {
		method: "GET",
		path: ["relatorios", "folhas-ponto", "exportar"],
		responseType: "blob" as const,
	},
};

export default relatorioAPIRoutes;
