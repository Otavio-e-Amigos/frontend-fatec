import type AbstractQueryObject from "~/modules/api/base/AbstractQueryObject"

const authAPIRoutes = {
	LOGIN: {
		path: ["autenticacao", "login"],
		method: 'POST',
		body: undefined //required
	}
}

export default authAPIRoutes
