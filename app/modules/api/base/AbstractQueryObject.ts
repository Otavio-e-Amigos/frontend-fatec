/**
 * Helper query interface which stores all of query data on a semi-structured object, whilst it allows for custom parameters for other extended API Modules
 */
export default interface AbstractQueryObject {
	path?: Array<string | number | undefined>; //API's uri path separated in arrays. You can set predefined paths and extend them with external dynamic values (e.g. /professors/1/cool ; ['professor', 1, 'cool'])
	arguments?: { param: string; value: string | number }; //uri arguments, separated in dictionary for easier access (e.g. ?limit=1&?type=rose ; {limit: 1, type: 'rose'})
	method?: string; //uri's method (GET, POST, ...)
	body?: any;
	headers?: Record<string, string>;
	credentials?: any
}
