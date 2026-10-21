export class ApiUnavailableError extends Error {
	constructor(
		message = "Não foi possível se conectar ao servidor. Verifique sua conexão e tente novamente.",
	) {
		super(message);
		this.name = "ApiUnavailableError";
	}
}