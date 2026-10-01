import type { AbstractAPIDataInit } from "../../base/AbstractAPIData";
import AbstractAPIModule from "../../base/AbstractAPIModule";
import type AbstractQueryObject from "../../base/AbstractQueryObject";
import DefaultAPIData from "./DefaultAPIData";
import axios from "axios";

/**
 * API Module which mimics requests and simulate results for testing environments
 */
export class DefaultAPIModule extends AbstractAPIModule {
	constructor() {
		super(import.meta.env.VITE_API_HOST as string, {
			https: Boolean(import.meta.env.VITE_API_HTTPS),
			path: import.meta.env.VITE_API_PATH,
		});
	}

	/**
	 * Creates an fake request for simulating environments and behaviors. You can set parameters for faking statuses, returnings and more situations as you desire.
	 * By design, you can leave this in a development envinronment and then replace it with a real module without needing to tweak everything, just replace the module with a real one.
	 * @param req Request parameters. MockAPIModule only uses it's own property (mock) for faking the response. If nothing is set, it will always return successfull with undefined data and response body.
	 */
	request<T>(req: AbstractQueryObject): Promise<DefaultAPIData> {
		const init: AbstractAPIDataInit = {
			status: 200,
			ok: true,
			data: undefined,
		};
		const apiData = new DefaultAPIData(init);

		function parsePath(arr?: Array<string | number | undefined>) {
			if (!arr) return;
			return arr.join("/");
		}

		const path = parsePath(req.path);
		const headers: Record<string, any> = { "Content-Type": "application/json" }

		if (req.credentials) {
			headers['Authorization'] = `Bearer ${req.credentials.token}`
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
				apiData.rawData = res.data;
				apiData.status = res.status;
				// init.ok = true
				return apiData;
			});

		return new Promise<DefaultAPIData>((resolve) => resolve(res));
		// const mock = new DefaultAPIData(init);
		// return mock;
		// "simulates" an API request using the QueryObject's body or completely ignores it
		// adds mock behavior to function and class, simulating behaviors depending of whats given for MockQuery object.
		// creates a new MockAPIData and returns to user
		// throw new Error("Method not implemented.");
	}
}
