import AbstractAPIData, {
	type AbstractAPIDataInit,
	type AbstractAPIDataParseOptions,
} from "../../base/AbstractAPIData";

export type MockAPIDataInit = AbstractAPIDataInit & {data?: any}

/**
 * API data class which fill objects from fake data with random/dataset for testing purposes
 */
export default class MockAPIData extends AbstractAPIData {
	rawData: any;

	constructor(init: AbstractAPIDataInit & {data?: any}) {
		super(init);
		this.rawData = init.data
	}

	/**
	 * Fakes a parsing process from data coming to rawData property for testing purposes.
	 * By design, you can leave this in a development envinronment and then replace it with a real module without needing to tweak everything, just replace the module with a real one.
	 * @param options
	 */
	parse<T>(options: AbstractAPIDataParseOptions): T {
		/**
		 * This method should (as i believe that it's behavior will be the same as DefaultAPIData when it will be created):
		 *	- get pointer where data is located API's response body
		 * 	- manipulate data according to configuration given by `options` parameter:
		 * 		- if mandated to return raw, returns raw data
		 * 		- if mandated to return as classes, get class pointer on parameter and returns a new created object with data inside it
		 *				- Should take note that functions maps all properties that matches names from object's, you need to structure it using a mapper function if needed.
		 * 		- if mandated to return as plain object, transfers data into a mapped function and returns.
		 */
		throw new Error("Method not implemented.");
	}
}
