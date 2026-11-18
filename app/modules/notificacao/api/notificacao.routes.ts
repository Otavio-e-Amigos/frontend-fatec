const notificacaoAPIRoutes = {
	GET_ALL: { method: "GET", path: ["notificacoes"] },
	CONTAGEM: { method: "GET", path: ["notificacoes", "contagem"] },
	// o id entra no segundo item do caminho na hora da chamada
	MARCAR_LIDA: { method: "PATCH", path: ["notificacoes", undefined, "lida"] },
	MARCAR_TODAS_LIDAS: { method: "PATCH", path: ["notificacoes", "lidas"] },
};

export default notificacaoAPIRoutes;
