import Disciplina from "../disciplina.class";

export default function toDisciplina(raw: any): Disciplina {
	return new Disciplina({
		id: raw.id,
		nome: raw.nome,
		codigo: raw.codigo,
		sigla: raw.sigla,
	});
}
