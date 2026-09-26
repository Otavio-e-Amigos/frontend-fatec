import { URL } from "node:url";

export abstract class AbstractAPIData {}

/**
 * EXPERIMENT: Base class for handling API requests and resolving errors when necessary
 */
export default abstract class AbstractAPIModule {
	public host: string;
	// port?: string;
	https?: boolean;
	path?: string;
	url: URL;

	constructor(
		host: string,
		param?: { port?: string; https?: boolean; path?: string },
	) {
		this.host = host;
		// this.port = param?.port;
		this.https = param?.https;
		this.path = param?.path;
		this.url = new URL(
			`${this.https ? "https" : "http"}://${host}${this.path && `/${this.path}`}`,
		);
	}

	abstract request<T>(url:string): AbstractAPIData;
}

export class MockAPIModule extends AbstractAPIModule {
	constructor() {
		super("dummy");
	}

	request<T>(url:string): AbstractAPIData {
		throw new Error("Method not implemented.");
	}
}
