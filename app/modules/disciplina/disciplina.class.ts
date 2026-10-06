export interface DisciplinaInterface{
    id?: number;
    cod?: string;
    acronym?: string;
    name?: string;

}

export default class Disciplina implements DisciplinaInterface {
    id?: number;
    cod?: string;
    acronym?: string;
    name?: string;

    constructor(init: DisciplinaInterface){
        this.id = init.id;
        this.cod = init.cod;
        this.acronym = init.acronym;
        this.name = init.name;
       
    }
}