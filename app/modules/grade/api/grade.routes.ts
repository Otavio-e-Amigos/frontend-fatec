const gradeRoutes = {
	CREATE: { method: "POST", path: ["grades"] },
	GET_BY_PROFESSOR: { method: "GET", path: ["professores", undefined, "grades"] },
	GET_BY_ID: { method: "GET", path: ["grades", undefined] },
	GET_DISCIPLINES: { method: "GET", path: ["grades", undefined, "disciplinas"] },
	GET_LESSONS: {
		method: "GET",
		path: ["disciplinas-grade", undefined, "aulas"],
	},
	CREATE_DISCIPLINE: { method: "POST", path: ["disciplinas-grade"] },
	CREATE_LESSON: {
		method: "POST",
		path: ["aulas-grade", "disciplinas-grade", undefined, "aulas"],
	},
};

export default gradeRoutes;
