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

	constructor(init: DisciplinaInterface) {
		this.id = init.id;
		this.nome = init.nome;
		this.codigo = init.codigo;
		this.sigla = init.sigla;
	}
}
