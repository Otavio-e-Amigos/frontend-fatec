const gradeRoutes = {
	GET_ALL: { method: "GET", path: ["grades"] },
	CREATE: { method: "POST", path: ["grades"] },
	GET_BY_PROFESSOR: { method: "GET", path: ["professores", undefined, "grades"] },
	GET_BY_ID: { method: "GET", path: ["grades", undefined] },
	UPDATE: { method: "PUT", path: ["grades", undefined] },
	DELETE: { method: "DELETE", path: ["grades", undefined] },
	GET_DISCIPLINES: { method: "GET", path: ["grades", undefined, "disciplinas"] },
	GET_DISCIPLINE_BY_ID: { method: "GET", path: ["disciplinas-grade", undefined] },
	UPDATE_DISCIPLINE: { method: "PUT", path: ["disciplinas-grade", undefined] },
	DELETE_DISCIPLINE: { method: "DELETE", path: ["disciplinas-grade", undefined] },
	GET_LESSONS: {
		method: "GET",
		path: ["disciplinas-grade", undefined, "aulas"],
	},
	GET_LESSON_BY_ID: { method: "GET", path: ["aulas-grade", undefined] },
	UPDATE_LESSON: { method: "PUT", path: ["aulas-grade", undefined] },
	CREATE_DISCIPLINE: { method: "POST", path: ["disciplinas-grade"] },
	DELETE_LESSON: { method: "DELETE", path: ["aulas-grade", undefined] },
	CREATE_LESSON: {
		method: "POST",
		path: ["aulas-grade", "disciplinas-grade", undefined, "aulas"],
	},
};

export default gradeRoutes;
