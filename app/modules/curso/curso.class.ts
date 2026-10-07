export interface CursoInterface {
    id?: number
    nome?: string;
    turno?: string;
    sigla?: string;
}

export default class Curso implements CursoInterface {
    id?: number;
    nome?: string;
    turno?: string;
    sigla?: string;

    constructor(init: CursoInterface) {
        this.id = init.id;
        this.nome = init.nome;
        this.turno = init.turno;
        this.sigla = init.sigla;
    }
}