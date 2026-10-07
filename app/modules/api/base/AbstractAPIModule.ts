// import { URL } from "node:url";
// import { URL } from "url";
import type AbstractAPIData from "./AbstractAPIData";
import type AbstractQueryObject from "./AbstractQueryObject";

/*
	REFLECT wouldn't be interesting if since requesting API data require objects now,
	you can create lookup tables for all requests and call them when necessary across codebase?
*/

interface URLObject {

}

interface AbstractAPIModuleInit {
	host: string
	port?: number
	https?: boolean
	path?: string
}

/**
 * EXPERIMENT: Base class for handling API requests and resolving errors when necessary
 */
export default abstract class AbstractAPIModule {
	//TODO transfer http protocol variables to DefaultAPIModule for allowing flexibility between classes if viable
	public host: string;
	port?: number;
	https?: boolean;
	path?: string; //if API's application layer lies on a specific path instead of the root of the server, you need to set this attribute too.
	url: string;

	constructor(init: AbstractAPIModuleInit) {
		this.host = init.host;
		this.https = init.https;
		this.port = init.port;
		this.path = init.path;
		this.url = `${this.https ? "https" : "http"}://${this.host}${this.port ? `:${this.port}` : ""}${this.path && `/${this.path}`}`
	}

	/**
	 * Makes a request to the API itself. It's process depends on each module,
	 * but it will must always return an APIData object or an error depending on the envinronment.
	 * @param req Request parameters using the QueryObject from each class
	 */
	abstract request<T>(req: AbstractQueryObject): Promise<AbstractAPIData> | AbstractAPIData;
}
