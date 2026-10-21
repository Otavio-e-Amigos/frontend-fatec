import { ApiUnavailableError } from "./ApiUnavailableError";

export default function getErrorMessage(
	error: unknown,
	fallback = "Ocorreu um erro inesperado. Tente novamente.",
) {
	if (error instanceof ApiUnavailableError) return error.message;
	if (error instanceof Error && error.message) return error.message;
	return fallback;
}