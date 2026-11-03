/** Dados enviados à API para gerar a prévia ou o documento. */
export interface FolhaPontoRequest {
	professorId: number;
	/** Opcional: se omitido, a API escolhe a grade do semestre do mês. */
	gradeId?: number;
	mes: number; // 1 a 12
	ano: number; // 2000 a 2050
}

export interface ProfessorResumo {
	id: number;
	nome: string;
	codigo: string;
	matricula: string;
	regimeJuridico: string;
	regimeContrato: string;
}

/** Uma aula ocupando UM slot da grade (aulas longas vêm repetidas, uma por slot). */
export interface AulaSlot {
	diaSemana: number; // 1 (segunda) a 6 (sábado)
	nomeDiaSemana: string;
	turno: "MANHA" | "TARDE" | "NOITE" | string;
	slot: number; // 1 a 6 (manhã/tarde) ou 1 a 4 (noite)
	sigla: string;
	nomeDisciplina: string;
	horarioInicio: string;
	horarioFim: string;
}

export interface DiaMes {
	dia: number;
	diaSemana: string;
	domingo: boolean;
	semAula: boolean;
	motivo: string | null;
}

export interface FolhaPontoPreviewInterface {
	professor: ProfessorResumo;
	mes: number;
	ano: number;
	titulo: string;
	gradeHoraria: AulaSlot[];
	dias: DiaMes[];
	avisos: string[];
}

export default class FolhaPontoPreview implements FolhaPontoPreviewInterface {
	declare professor: ProfessorResumo;
	declare mes: number;
	declare ano: number;
	declare titulo: string;
	declare gradeHoraria: AulaSlot[];
	declare dias: DiaMes[];
	declare avisos: string[];

	constructor(data: FolhaPontoPreviewInterface) {
		Object.assign(this, data);
	}
}