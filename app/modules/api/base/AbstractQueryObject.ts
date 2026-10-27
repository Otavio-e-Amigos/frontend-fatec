export interface QueryArgumentObject {
	param: string;
	value: string | number
}

/**
 * Helper query interface which stores all of query data on a semi-structured object, whilst it allows for custom parameters for other extended API Modules
 */
export default interface AbstractQueryObject {
	path?: Array<string | number | undefined>;
	arguments?: QueryArgumentObject[];
	method?: string;
	body?: any;
	headers?: Record<string, string>;
	credentials?: any;
	timeout?: number; // ms; padrão do módulo: 15000
}

/**
 * About QueryObject.path: is there a way of defining this dynamically and "object-like"? Like treating it as a object that you can set
 * it's dynamic parameters via functions safely and conventional?
 */
