import type AbstractQueryObject from "../api/base/AbstractQueryObject";
import { DefaultAPIModule } from "../api/modules/default/DefaultAPIModule";
import Professor from "./professor.class";
import User from "../user/user.class";
import professorAPIRoutes from "./api/professor.routes";
import mapper from "./api/professor.mapper";
import type { QueryArgumentObject } from "../api/base/AbstractQueryObject";
import DefaultAPIData from "../api/modules/default/DefaultAPIData";
import { FormValidationError } from "~/classes/errors/ValidationError";

export default class ProfessorService {
	static routes: typeof professorAPIRoutes = professorAPIRoutes;
	static module: DefaultAPIModule = new DefaultAPIModule();

	static async get(
		auth: User,
		params?: QueryArgumentObject,
	): Promise<Professor[]>;
	static async get(id: number, auth: User): Promise<Professor>;
	static async get(
		_idOrAuth: number | User,
		_authOrParams?: User | QueryArgumentObject,
	): Promise<Professor[] | Professor | undefined> {
		const id = typeof _idOrAuth === "number" ? _idOrAuth : undefined;
		const auth =
			typeof _idOrAuth === "number"
				? (_authOrParams as User)
				: (_idOrAuth as User);
		const params =
			typeof _idOrAuth !== "number" && _authOrParams
				? _authOrParams
				: undefined;

		const route = id ? this.routes.GET_BY_ID : this.routes.GET_ALL;
		const req: AbstractQueryObject = {
			...route,
			path: id ? ["professores", id] : ["professores"],
			credentials: auth,
			arguments: params as any,
		};

		try {
			const res = await this.module.request(req);
			if (res.ok) {
				if (typeof id === "number") {
					return mapper(res.rawData.dados ?? res.rawData);
				}
				const items =
					res.rawData.content ??
					res.rawData.dados ??
					(Array.isArray(res.rawData) ? res.rawData : []);
				return items.map(mapper).filter(Boolean);
			}
		} catch (e) {
			console.log(e);
		}
		return id ? undefined : [];
	}

	static async edit(
		id: number,
		data: Professor,
		auth: User,
	): Promise<Professor> {
		const form: any = {
			nome: data.name?.trim(),
			codigo: data.code?.trim() || null,
			cpf: data.cpf ? data.cpf.replaceAll(/\D/g, "") : "",
			matricula: data.registry?.trim(),
			regimeContrato: data.contract,
			regimeJuridico: (data as any).regimeJuridico || "CLT",
			titulacao: data.title,
		};

		const req: AbstractQueryObject = {
			...this.routes.EDIT,
			path: ["professores", id],
			body: form,
			credentials: auth,
		};

		try {
			const res = await this.module.request(req);

			return mapper(res.rawData.dados ?? res.rawData);
			// if (res.ok) {
			// }
		} catch (e) {
			console.log(e);
			throw e;
		}

		return data;
	}

	static async save(data: Professor, auth: User): Promise<Professor> {
		const form = {
			nome: data.name?.trim(),
			codigo: data.code?.trim() || null,
			cpf: data.cpf ? data.cpf.replaceAll(/\D/g, "") : "",
			matricula: data.registry?.trim(),
			regimeContrato: data.contract,
			regimeJuridico: (data as any).regimeJuridico || "CLT",
			titulacao: data.title,
		};

		const req: AbstractQueryObject = {
			...this.routes.SAVE,
			path: ["professores"],
			body: form,
			credentials: auth,
		};

		try {
			const res = await this.module.request(req);
			if (res.ok) {
				return mapper(res.rawData.dados ?? res.rawData);
			}
		} catch (e) {
			console.log(e);
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

		return data;
	}

	static async activate(id: number, auth: User): Promise<boolean> {
		const req: AbstractQueryObject = {
			...this.routes.ACTIVATE,
			path: ["professores", id, "status"],
			credentials: auth,
		};

		try {
			const res = await this.module.request(req);
			return res.ok;
		} catch (e) {
			console.log(e);
			return false;
		}
	}

	static async deactivate(id: number, auth: User): Promise<boolean> {
		const req: AbstractQueryObject = {
			...this.routes.DEACTIVATE,
			path: ["professores", id, "status"],
			credentials: auth,
		};

		try {
			const res = await this.module.request(req);
			return res.ok;
		} catch (e) {
			console.log(e);
			return false;
		}
	}
}
