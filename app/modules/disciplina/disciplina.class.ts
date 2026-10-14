export interface DisciplinaInterface {
	id?: number;
	nome?: string;
	codigo?: string;
	sigla?: string;
}

export default class Disciplina implements DisciplinaInterface {
	id?: number;
	nome?: string;
	codigo?: string;
	sigla?: string;

	constructor(data: DisciplinaInterface) {
		Object.assign(this, data);
	}
}
