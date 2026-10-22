import DefaultAPIData from "~/modules/api/modules/default/DefaultAPIData";
import { ApiUnavailableError } from "./ApiUnavailableError";

export default function getErrorMessage(
	error: unknown,
	fallback = "Ocorreu um erro inesperado. Tente novamente.",
) {
	if (error instanceof ApiUnavailableError) return error.message;
	// Respostas de erro da API chegam como DefaultAPIData, não como Error.
	if (error instanceof DefaultAPIData) {
		return error.error?.message || error.rawData?.mensagem || fallback;
	}
	if (error instanceof Error && error.message) return error.message;
	return fallback;
}