import AbstractAPIData, { type AbstractAPIDataInit, type AbstractAPIDataParseOptions } from "../../base/AbstractAPIData";


export default class DefaultAPIData extends AbstractAPIData {
	rawData: any;
	dataPropertyPointer:string = "dados"

	constructor(init: AbstractAPIDataInit) {
		super(init)
		this.rawData = init.data
	}

	parse<T>(options?: AbstractAPIDataParseOptions): T {
		throw new Error("Method not implemented.");
	}

	getData<T>(raw?: boolean): void {

	}
}
