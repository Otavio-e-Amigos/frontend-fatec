const cursoAPIRoutes = {
    GET_ALL: { method: "GET", path: ["cursos"] },
    GET_BY_ID: { method: "GET", path: ["cursos", undefined] },
    SAVE: { method: "POST", path: ["cursos"] },
    EDIT: { method: "PUT", path: ["cursos", undefined] },
}

export default cursoAPIRoutes;