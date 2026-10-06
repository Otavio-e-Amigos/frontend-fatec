import type { AbstractAPIDataInit } from "../../base/AbstractAPIData";
import AbstractAPIModule from "../../base/AbstractAPIModule";
import type AbstractQueryObject from "../../base/AbstractQueryObject";
import DefaultAPIData from "./DefaultAPIData";
import axios from "axios";

// TODO change to localhost API if .env one is not available or by other means (var declaring to use localhost)
const API_HOST = import.meta.env.VITE_API_HOST as string;
const API_PATH = import.meta.env.VITE_API_PATH as string;
const API_HTTPS = Boolean(import.meta.env.VITE_API_HTTPS);

/**
 * System's API Module
 */
export class DefaultAPIModule extends AbstractAPIModule {
	constructor() {
		super(API_HOST, {
			https: API_HTTPS,
			path: API_PATH,
		});
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
				data: req.body,
				headers: headers,
			})
			.then((res) => {
				// console.log("res");
				// console.log(res);
				data.rawData = res.data;
				data.status = res.status;
				// init.ok = true
				return data;
			});

		return new Promise<DefaultAPIData>((resolve) => resolve(res));
	}
}
