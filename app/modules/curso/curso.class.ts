export interface CursoInterface{
    id?: number;
    name?: string;
    shift?: "MANHA" | "TARDE" | "NOITE";
    unit?: string;
    acronym?: string;

}

export default class Curso implements CursoInterface {
    id?: number;
    name?: string;
    shift?: "MANHA" | "TARDE"| "NOITE";
    unit?    : string;
    acronym?: string; 

    constructor(init: CursoInterface){
        this.id = init.id;
        this.name = init.name;
        this.shift = init.shift;
        this.unit = init.unit;
        this.acronym = init.acronym;
    }
}