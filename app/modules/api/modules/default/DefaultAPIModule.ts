import type { AbstractAPIDataInit } from "../../base/AbstractAPIData";
import AbstractAPIModule from "../../base/AbstractAPIModule";
import type AbstractQueryObject from "../../base/AbstractQueryObject";
import DefaultAPIData from "./DefaultAPIData";
import axios from "axios";

// TODO change to localhost API if .env one is not available or by other means (var declaring to use localhost)
const API_HOST = import.meta.env.VITE_API_HOST as string;
const API_PATH = import.meta.env.VITE_API_PATH as string;
const API_HTTPS = import.meta.env.VITE_API_HTTPS === 'true' ? true : false;
const API_PORT = Number(import.meta.env.VITE_API_PORT);

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
		console.log(this.url)
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
		const headers: Record<string, any> = { "Content-Type": "application/json" };

		if (req.credentials) {
			headers["Authorization"] = `Bearer ${req.credentials.token}`;
		}

		console.log(path);

		const res = axios
			.request({
				method: req.method,
				baseURL: this.url,
				url: path,
				params: req.arguments,
				data: req.body,
				headers: headers,
			})
			.then((res) => {
				data.rawData = res.data;
				data.status = res.status;
				data.ok = res.status >= 200 && res.status < 300;
				return data;
			})
			.catch((err) => {
				if (err.response) {
					data.rawData = err.response.data;
					data.status = err.response.status;
				} else {
					data.status = 500;
				}
				data.ok = false;
				return data;
			});

		return res;
	}
}
