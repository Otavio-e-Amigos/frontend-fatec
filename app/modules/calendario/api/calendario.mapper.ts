import EventoCalendario from "../calendario.class";

export default function mapper(item: any) {
	return new EventoCalendario({
		data: String(item.data ?? "").slice(0, 10),
		descricao: item.descricao,
		tipo: item.tipo,
		semAula: Boolean(item.semAula),
	});
}
