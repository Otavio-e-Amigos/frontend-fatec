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
export default class Professor implements ProfessorInterface {
	name?: string;
	cpf?: string;
	registry?: string;
	contract?: "DETERMINADO" | "INDERTEMINADO" | "TEMPORARIO" | string;
	status?: "ATIVO" | "INATIVO" | "AFASTADO" | string;
	title?:
		"GRADUADO" | "ESPECIALISTA" | "MESTRE" | "DOUTOR" | "POS_DOUTOR" | string;
	code?: string;
	id?: number;

	constructor(init: ProfessorInterface) {
		this.name = init.name;
		this.cpf = init.cpf;
		this.registry = init.registry;
		this.contract = init.contract;
		this.status = init.status;
		this.title = init.title;
		this.code = init.code;
		this.id = init.id;
	}
}
