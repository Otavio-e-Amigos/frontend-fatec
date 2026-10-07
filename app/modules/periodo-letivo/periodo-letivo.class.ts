export interface PeriodoLetivoInterface {
    id?: number;
    semestre?: number;
    ano?: number;
    dataInicio?: string;
    dataFim?: string;
}

export default class PeriodoLetivo implements PeriodoLetivoInterface {
    id?: number;
    semestre?: number;
    ano?: number;
    dataInicio?: string;
    dataFim?: string;
    constructor(data: PeriodoLetivoInterface) {
        Object.assign(this, data);
    }
}
