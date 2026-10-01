interface JSONExportable {
	toJSON(): string;
}

export default class Professor {
	// public name: string;
	constructor(
		public name: string,
		public cpf: string,
		public registry: string,
		public contract: "DETERMINADO" | "INDERTEMINADO" | "TEMPORARIO" | string,
		public status: "ATIVO" | "INATIVO" | "AFASTADO" | string,
		public title?: "GRADUADO" | "ESPECIALISTA" | "MESTRE" | "DOUTOR" | "PÓS-DOUTOR" | string,
		public code?: string,
		public id?: number,
	) {
		// this.name = name;
	}

	// get name(): string {
	// 	return this._name
	// }

	// set name(newName: string) {
	// 	this._name = newName
	// }
}
