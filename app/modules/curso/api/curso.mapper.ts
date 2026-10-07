import Curso from "../curso.class";

export default function toCurso(cu: any): Curso | undefined {
    if (!cu) return undefined;
    return new Curso({
        id: cu.id,
        nome: cu.nome,
        turno: cu.turno,
        sigla: cu.sigla,
    });
}

