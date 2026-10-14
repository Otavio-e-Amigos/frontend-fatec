const disciplinaAPIRoutes = {
	GET_ALL: { method: "GET", path: ["disciplinas"] },
	GET_BY_ID: { method: "GET", path: ["disciplinas", undefined] },
	SAVE: { method: "POST", path: ["disciplinas"] },
	EDIT: { method: "PUT", path: ["disciplinas", undefined] },
	DELETE: { method: "DELETE", path: ["disciplinas", undefined] },
};

export default disciplinaAPIRoutes;
