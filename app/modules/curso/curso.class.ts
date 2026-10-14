export interface CursoInterface {
	id?: number;
	nome?: string;
	turno?: string;
	sigla?: string;
}

export default class Curso implements CursoInterface {
	id?: number;
	nome?: string;
	turno?: string;
	sigla?: string;

	constructor(data: CursoInterface) {
		Object.assign(this, data);
	}
}
