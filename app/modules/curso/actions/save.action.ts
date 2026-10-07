import type { SyntheticEvent } from "react";
import User from "~/modules/user/user.class";
import Curso from "../curso.class";
import CursoService from "../curso.service";

export default async function saveCurso(event: SyntheticEvent<HTMLFormElement>, id?: number) {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget));
    const curso = new Curso({
        id,
        nome: form.nome as string,
        turno: form.turno as string,
        sigla: form.sigla as string,
    });
    const auth = new User(JSON.parse(localStorage.getItem("auth") ?? "{}"));
    return id
        ? CursoService.edit(id, curso, auth)
        : CursoService.save(curso, auth);
}
