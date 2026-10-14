import type AbstractQueryObject from "../api/base/AbstractQueryObject";
import { DefaultAPIModule } from "../api/modules/default/DefaultAPIModule";
import User from "../user/user.class";
import toDisciplina from "./api/disciplina.mapper";
import Disciplina from "./disciplina.class";
import disciplinaAPIRoutes from "./api/disciplina.routes";
import { FormValidationError } from "~/classes/errors/ValidationError";
import DefaultAPIData from "../api/modules/default/DefaultAPIData";

export default class DisciplinaService {
	static module = new DefaultAPIModule();
	static routes = disciplinaAPIRoutes;

	static async get(auth: User): Promise<Disciplina[]>;
	static async get(id: number, auth: User): Promise<Disciplina | undefined>;
	static async get(idOrAuth: number | User, maybeAuth?: User) {
		const id = typeof idOrAuth === "number" ? idOrAuth : undefined;
		const auth = typeof idOrAuth === "number" ? maybeAuth! : idOrAuth;
		const route = id ? this.routes.GET_BY_ID : this.routes.GET_ALL;
		const req: AbstractQueryObject = {
			...route,
			path: [...route.path],
			credentials: auth,
		};

		if (id) req.path![1] = id;
		const res = await this.module.request(req);
		if (!res.ok) return id ? undefined : [];

		if (id) return toDisciplina(res.rawData.dados);
		const items = res.rawData.content ?? res.rawData.dados ?? [];
		return items.map(toDisciplina);
	}

	static async save(
		data: Disciplina,
		auth: User,
	): Promise<Disciplina | undefined> {
		return this.write(this.routes.SAVE, data, auth);
	}

	static async edit(
		id: number,
		data: Disciplina,
		auth: User,
	): Promise<Disciplina | undefined> {
		return this.write(this.routes.EDIT, data, auth, id);
	}

	static async delete(id: number, auth: User): Promise<boolean> {
		const req: AbstractQueryObject = {
			...this.routes.DELETE,
			path: ["disciplinas", id],
			credentials: auth,
		};
		const res = await this.module.request(req);
		return res.ok;
	}

	private static async write(
		route: typeof disciplinaAPIRoutes.SAVE | typeof disciplinaAPIRoutes.EDIT,
		data: Disciplina,
		auth: User,
		id?: number,
	) {
		const req: AbstractQueryObject = {
			...route,
			path: id ? ["disciplinas", id] : ["disciplinas"],
			body: {
				nome: data.nome?.trim(),
				codigo: data.codigo?.trim(),
				sigla: data.sigla?.trim(),
			},
			credentials: auth,
		};
		try {
			const res = await this.module.request(req);
			return res.ok ? toDisciplina(res.rawData.dados) : undefined;
		} catch (e) {
			console.log(e)
			if (e instanceof DefaultAPIData) {
				const message = e.rawData.mensagem;
				switch (e.status) {
					case 400:
						throw new FormValidationError(message ?? "Erro de validação", [
							message,
						]);
					case 401:
						throw new FormValidationError(message ?? "Não autorizado", [
							message,
						]);
					default:
						throw new Error("Erro ao salvar dados");
				}
			}
			throw e;
		}
	}
}
