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

	constructor(data: ProfessorInterface) {
		Object.assign(this, data);
	}
}
