import FolhaPontoPreview, { type AulaSlot, type DiaMes } from "../folha-ponto.class";

// Único lugar que monta a prévia a partir da resposta da API,
// garantindo valores padrão para campos que podem vir nulos.
export default function toFolhaPontoPreview(raw: any): FolhaPontoPreview {
	return new FolhaPontoPreview({
		professor: {
			id: Number(raw.professor?.id),
			nome: raw.professor?.nome ?? "",
			codigo: raw.professor?.codigo ?? "",
			matricula: raw.professor?.matricula ?? "",
			regimeJuridico: raw.professor?.regimeJuridico ?? "",
			regimeContrato: raw.professor?.regimeContrato ?? "",
		},
		mes: Number(raw.mes),
		ano: Number(raw.ano),
		titulo: raw.titulo ?? "",
		gradeHoraria: (raw.gradeHoraria ?? []).map(
			(slot: any): AulaSlot => ({
				diaSemana: Number(slot.diaSemana),
				nomeDiaSemana: slot.nomeDiaSemana ?? "",
				turno: slot.turno ?? "",
				slot: Number(slot.slot),
				sigla: slot.sigla ?? "",
				nomeDisciplina: slot.nomeDisciplina ?? "",
				horarioInicio: slot.horarioInicio ?? "",
				horarioFim: slot.horarioFim ?? "",
			}),
		),
		dias: (raw.dias ?? []).map(
			(dia: any): DiaMes => ({
				dia: Number(dia.dia),
				diaSemana: dia.diaSemana ?? "",
				domingo: Boolean(dia.domingo),
				semAula: Boolean(dia.semAula),
				motivo: dia.motivo ?? null,
			}),
		),
		avisos: raw.avisos ?? [],
	});
}