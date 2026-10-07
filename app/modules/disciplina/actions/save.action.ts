import type { SyntheticEvent } from "react";
import User from "~/modules/user/user.class";
import Disciplina from "../disciplina.class";
import DisciplinaService from "../disciplina.service";

export default async function saveDisciplina(event: SyntheticEvent<HTMLFormElement>, id?: number) {
	event.preventDefault();
	const form = Object.fromEntries(new FormData(event.currentTarget));
	const disciplina = new Disciplina({
		id,
		nome: form.nome as string,
		codigo: form.codigo as string,
		sigla: form.sigla as string,
	});
	const auth = new User(JSON.parse(localStorage.getItem("auth") ?? "{}"));
	return id
		? DisciplinaService.edit(id, disciplina, auth)
		: DisciplinaService.save(disciplina, auth);
}
