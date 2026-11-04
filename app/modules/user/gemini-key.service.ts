import DefaultAPIData from "../api/modules/default/DefaultAPIData";
import { DefaultAPIModule } from "../api/modules/default/DefaultAPIModule";
import type User from "./user.class";

const path = ["usuarios", "me", "gemini-api-key"];

/** Manages the logged user's personal Gemini API key. */
export default class GeminiKeyService {
	static module = new DefaultAPIModule();

	private static async request(method: string, auth: User, body?: unknown) {
		try {
			// the API validates the key against Gemini, so it can take a few seconds
			return await this.module.request({
				method,
				path,
				body,
				credentials: auth,
				timeout: 30_000,
			});
		} catch (error) {
			if (error instanceof DefaultAPIData && error.rawData?.mensagem) {
				throw new Error(error.rawData.mensagem);
			}
			throw error;
		}
	}

	/** True when the user has a personal key configured. */
	static async has(auth: User): Promise<boolean> {
		const response = await this.request("GET", auth);
		return response.rawData?.dados === true;
	}

	/** Validates and saves the key. Returns the API's message. */
	static async save(apiKey: string, auth: User): Promise<string> {
		const response = await this.request("PUT", auth, { apiKey });
		return response.rawData?.mensagem ?? "Chave salva.";
	}

	/** Removes the personal key (the server's default key is used again). */
	static async remove(auth: User): Promise<string> {
		const response = await this.request("DELETE", auth);
		return response.rawData?.mensagem ?? "Chave removida.";
	}
}