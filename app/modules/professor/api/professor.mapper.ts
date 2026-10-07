import Professor from "../professor.class";

// Único lugar que monta o Professor a partir da resposta da API.
// A API não retorna "cpf", então usamos "" para não deixar undefined.
export default function toProfessor(prof: any): Professor {
	return new Professor({
		name: prof.nome,
		cpf: prof.cpf ?? "",
		registry: prof.matricula ?? "",
		contract: prof.regimeContrato ?? "",
		status: prof.status ?? "",
		title: prof.titulacao ?? "",
		code: prof.codigo ?? "",
		id: prof.id,
	});
}
