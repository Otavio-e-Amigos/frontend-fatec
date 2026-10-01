export interface AbstractAPIDataInit {
	status: number;
	ok: boolean;
	data?: any
}

export interface AbstractAPIDataParseOptions {}

/**
 *	Class which parses raw data from API to structured objects and classes by passing raw classes inside, as well as other functionalities (maybe)
 */
export default abstract class AbstractAPIData {
	abstract rawData: unknown; //set of structures which API may return, it can be one or many ig
	status: number; //return status (e.g. 200)
	ok: boolean; //did the request got successfull?
	//TODO add pointer to data coming from API. Take note that pointer may change based on structure

	constructor(init: AbstractAPIDataInit) {
		this.status = init.status;
		this.ok = init.ok;
	}

	/**
	 * Parses API's body response into structured data like classes or plain objects depending on your necessity.
	 * Modules may have different behaviors and needs when parsing it's result, so it's interesting to be cautious and read about it when implementing.
	 * @param options Options object for configuring parsing behaviors
	 */
	abstract parse<T>(options?: AbstractAPIDataParseOptions): T;

	get<T>(raw?: boolean) {}
}
