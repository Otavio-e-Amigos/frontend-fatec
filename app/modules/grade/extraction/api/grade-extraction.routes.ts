const gradeExtractionRoutes = {
	EXTRACT: { method: "POST", path: ["grades", "importacao", "extrair"] },
	VALIDATE: { method: "POST", path: ["grades", "importacao", "validar"] },
};

export default gradeExtractionRoutes;