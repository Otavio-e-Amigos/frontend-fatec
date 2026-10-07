import AbstractAPIData, { type AbstractAPIDataInit, type AbstractAPIDataParseOptions } from "../../base/AbstractAPIData";


export default class DefaultAPIData extends AbstractAPIData {
	rawData: any;
	dataPropertyPointer:string = "dados"

	constructor(init: AbstractAPIDataInit) {
		super(init)
		this.rawData = init.data
		// TODO insert requested data into rawData, whilst body needs to be on other attribute (this.body?)
		// because of this when using parse(), DefaultAPIData will grab the returned data and convert into classes/other formats
	}

	parse<T>(options?: AbstractAPIDataParseOptions): T {
		throw new Error("Method not implemented.");
	}

	getData<T>(raw?: boolean): void {

	}
}
