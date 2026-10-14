import PeriodoLetivo from "../periodo-letivo.class";

export default function mapper(item: any) {
	return new PeriodoLetivo({
		id: item.id,
		semestre: item.semestre,
		ano: item.ano,
		dataInicio: item.dataInicio ?? item.data_inicio,
		dataFim: item.dataFim ?? item.data_fim,
	});
}
