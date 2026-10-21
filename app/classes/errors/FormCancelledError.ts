export class FormCancelledError extends Error {
	constructor() {
		super("Envio cancelado pelo usuário.");
		this.name = "FormCancelledError";
	}
}