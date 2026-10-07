import Professor from "../professor.class";

// Único lugar que monta o Professor a partir da resposta da API.
// A API não retorna "cpf", então usamos "" para não deixar undefined.
export default function toProfessor(prof: any): Professor | undefined {
	if (!prof) return undefined;
	return new Professor({
		name: prof.nome ?? prof.name ?? "",
		cpf: prof.cpf ?? "",
		registry: prof.matricula ?? prof.registry ?? "",
		contract: prof.regimeContrato ?? prof.contract ?? "",
		status: prof.status ?? "",
		title: prof.titulacao ?? prof.title ?? "",
		code: prof.codigo ?? prof.code ?? "",
		id: prof.id,
	});
}
