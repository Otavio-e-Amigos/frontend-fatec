export interface ProfessorInterface {
	name?: string;
	cpf?: string;
	registry?: string;
	contract?: "DETERMINADO" | "INDERTEMINADO" | "TEMPORARIO" | string;
	status?: "ATIVO" | "INATIVO" | "AFASTADO" | string;
	title?:
		"GRADUADO" | "ESPECIALISTA" | "MESTRE" | "DOUTOR" | "POS_DOUTOR" | string;
	code?: string;
	id?: number;
}

// TODO change internal constructor to interface constructor type
export default class Professor {

	constructor(
		public name: string,
		public cpf: string,
		public registry: string,
		public contract: "DETERMINADO" | "INDERTEMINADO" | "TEMPORARIO" | string,
		public status: "ATIVO" | "INATIVO" | "AFASTADO" | string,
		public title?:
			"GRADUADO" | "ESPECIALISTA" | "MESTRE" | "DOUTOR" | "POS_DOUTOR" | string,
		public code?: string,
		public id?: number,
	) {
	}

}
