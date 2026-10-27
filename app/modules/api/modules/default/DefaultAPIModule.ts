import { APIValidationError } from "~/classes/errors/ValidationError";
import type { AbstractAPIDataInit } from "../../base/AbstractAPIData";
import AbstractAPIModule from "../../base/AbstractAPIModule";
import type AbstractQueryObject from "../../base/AbstractQueryObject";
import DefaultAPIData from "./DefaultAPIData";
import axios, { AxiosError } from "axios";
import { ApiUnavailableError } from "~/classes/errors/ApiUnavailableError";
import { apiStatus } from "../../api-status";

// TODO change to localhost API if .env one is not available or by other means (var declaring to use localhost)
const API_HOST = import.meta.env.VITE_API_HOST as string;
const API_PATH = import.meta.env.VITE_API_PATH as string;
const API_HTTPS = import.meta.env.VITE_API_HTTPS === "true" ? true : false;
const API_PORT = Number(import.meta.env.VITE_API_PORT);

// Evita redirecionar várias vezes quando várias requisições falham juntas (ex.: loaders em paralelo).
let redirectingToLogin = false;

/** Limpa a sessão e leva o usuário para a página de login. */
function sendToLogin() {
	if (typeof window === "undefined") return;
	if (window.location.pathname === "/login" || redirectingToLogin) return;

	redirectingToLogin = true;
	window.localStorage.removeItem("auth");
	window.location.replace("/login?sessao=expirada");
}
/**
 * System's API Module
 */

export class DefaultAPIModule extends AbstractAPIModule {
	constructor() {
		super({
			host: API_HOST,
			port: API_PORT,
			https: API_HTTPS,
			path: API_PATH,
		});
		console.log(this.url);
	}

	/**
	 * Makes a request for system's API
	 * @param req Request parameters.
	 */
	request<T>(req: AbstractQueryObject): Promise<DefaultAPIData> {
		const init: AbstractAPIDataInit = {
			status: 200,
			ok: true,
			data: undefined,
		};
		const data = new DefaultAPIData(init);

		function parsePath(arr?: Array<string | number | undefined>) {
			if (!arr) return;
			return arr.join("/");
		}

		const path = parsePath(req.path);
		// troque a linha do headers:
		const isFormData = typeof FormData !== "undefined" && req.body instanceof FormData;
		// no upload o navegador define o multipart com o boundary; não force o Content-Type
		const headers: Record<string, any> = isFormData ? {} : { "Content-Type": "application/json" };

		// e no axios.request(...):
		
		const params = req.arguments
			? new URLSearchParams(
				req.arguments.map(({ param, value }) => [param, String(value)]),
			)
			: undefined;

		if (req.credentials) {
			headers["Authorization"] = `Bearer ${req.credentials.token}`;
		}

		console.log(path);

		const res = axios
			.request({		
				method: req.method,
				baseURL: this.url,
				url: path,
				params,
				data: req.body,
				timeout: req.timeout ?? 15000,
				headers: headers,
			})
			.then((res) => {
				apiStatus.report(true);
				data.rawData = res.data;
				data.status = res.status;
				data.ok = res.status >= 200 && res.status < 300;
				return data;
			})
			.catch((err) => {
				// sem err.response: servidor fora do ar, sem rede ou timeout
				if (!err.response) {
					apiStatus.report(false);
					throw new ApiUnavailableError();
				}
				apiStatus.report(true);

				data.status = err.response.status;
				data.ok = false;
				data.rawData = err.response.data;

				switch (data.status) {
					// ... (mantenha o switch exatamente como está)
					case 400: {
						data.error = new APIValidationError(data.rawData.mensagem, data);
						throw data
					}
					case 401: {
						// Sessão expirada ou token inválido em uma requisição autenticada.
						// O login com senha errada não cai aqui, pois não envia credentials.
						if (req.credentials) {
							sendToLogin();
							// Nunca resolve: a página está sendo trocada, então nada abaixo
							// (toasts, tela de erro) precisa rodar.
							return new Promise<never>(() => { });
						}
						data.error = new APIValidationError(data.rawData.mensagem, data);
						throw data
					}
					case 409: {
						data.error = new APIValidationError(data.rawData.mensagem, data);
						throw data
					}
					default: {
						//TODO switch to APIInternalError
						data.error = new Error()
						throw data
					}
				}
				// REFLECT i could make DefaultAPIData an error attribute and map it accordingly in a generic way
				// so services could react accordingly to the error in a simpler way

				// switch (data.status) {
				// 	case 400: {
				// 		throw new APIValidationError(data.rawData.mensagem, [], data)
				// 	}
				// }
				// throw data;
				return data;
			});

		return res;
	}
}
