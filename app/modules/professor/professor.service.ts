import type AbstractQueryObject from "../api/base/AbstractQueryObject";
import { DefaultAPIModule } from "../api/modules/default/DefaultAPIModule";
import Professor from "./professor.class";
import User from "../user/user.class";
import professorAPIRoutes from "./professor.apiRoutes";
import toProfessor from "./api/professor.mapper";

export default class ProfessorService {
	static routes: typeof professorAPIRoutes = professorAPIRoutes;
	static module: DefaultAPIModule = new DefaultAPIModule();

	static async get(auth: User, params?: Record<string, any>): Promise<Professor[]>;
	static async get(id: number, auth: User): Promise<Professor>;
	static async get(
		_idOrAuth: number | User,
		_authOrParams?: User | Record<string, any>,
	): Promise<Professor[] | Professor | undefined> {
		const id = typeof _idOrAuth === "number" ? _idOrAuth : undefined;
		const auth = typeof _idOrAuth === "number" ? (_authOrParams as User) : (_idOrAuth as User);
		const params = typeof _idOrAuth !== "number" && _authOrParams ? _authOrParams : undefined;

		const route = id ? this.routes.GET_BY_ID : this.routes.GET_ALL;
		const req: AbstractQueryObject = {
			...route,
			path: id ? ["professores", id] : ["professores"],
			credentials: auth,
			arguments: params,
		};

		try {
			const res = await this.module.request(req);
			if (res.ok) {
				if (typeof id === "number") {
					return toProfessor(res.rawData.dados ?? res.rawData);
				}
				const items = res.rawData.content ?? res.rawData.dados ?? (Array.isArray(res.rawData) ? res.rawData : []);
				return items.map(toProfessor).filter(Boolean);
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
			if (res.ok) {
				return toProfessor(res.rawData.dados ?? res.rawData);
			}
		} catch (e) {
			console.log(e);
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
				return toProfessor(res.rawData.dados ?? res.rawData);
			}
		} catch (e) {
			console.log(e);
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
