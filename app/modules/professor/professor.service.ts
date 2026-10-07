import type AbstractQueryObject from "../api/base/AbstractQueryObject";
import { DefaultAPIModule } from "../api/modules/default/DefaultAPIModule";
import Professor from "./professor.class";
import User from "../user/user.class";
import professorAPIRoutes from "./professor.apiRoutes";
import toProfessor from "./api/professor.mapper";

export default class ProfessorService {
	static routes: typeof professorAPIRoutes = professorAPIRoutes;
	static module: DefaultAPIModule = new DefaultAPIModule();

	static async get(auth: User): Promise<Professor[]>;
	static async get(id: number, auth: User): Promise<Professor>;
	static async get(
		_id: number | User,
		_auth?: User,
	): Promise<Professor[] | Professor | undefined> {
		const id = typeof _id === "number" ? _id : undefined;
		const auth = typeof _id === "number" ? _auth : _id;

		const req: AbstractQueryObject = id
			? this.routes.GET_BY_ID
			: this.routes.GET_ALL;
		req.credentials = auth;
		if (id) req.path![1] = id;

		// ... o resto continua igual (try/catch, toProfessor etc.)

		try {
			const res = await this.module.request(req);

			console.log(res);

			if (res.ok) {
				if (typeof id === "number") {
					return toProfessor(res.rawData.dados);
				}

				if (!id) {
					// TODO change to APIData pointer
					return res.rawData.content.map(toProfessor);
				} else {
					// TODO change to APIData pointer
					return res.rawData.dados.map(toProfessor);
				}
			}
		} catch (e) {
			console.log(e);
		}
	}

	static async edit(
		id: number,
		data: Professor,
		auth: User,
	): Promise<Professor> {
		const form: any = {
			nome: data.name,
			matricula: data.registry,
			regimeContrato: data.contract,
			status: data.status,
			titulacao: data.title,
			codigo: data.code,
		};

		if (data.cpf) {
			form["cpf"] = data.cpf;
		}

		const req:AbstractQueryObject = this.routes.EDIT;
		req.body = form;
		req.path![1] = String(id);
		req.credentials = auth as any;

		try {
			const res = await this.module.request(req);

			console.log(res);

			if (res.ok) {
				console.log("professor edited!");

				return toProfessor(res.rawData.dados);
			}
		} catch (e) {
			console.log(e);
		}

		return data;
	}

	static async save(data: Professor, auth: User): Promise<Professor> {
		console.log("saving professor!");
		console.log("checking user credentials!");
		console.log(auth);

		const form = {
			nome: data.name,
			cpf: data.cpf,
			matricula: data.registry,
			regimeContrato: data.contract,
			status: data.status,
			titulacao: data.title,
			codigo: data.code,
		};

		const req: AbstractQueryObject = this.routes.SAVE;
		req.body = form;
		req.credentials = auth;

		try {
			const res = await this.module.request(req);

			console.log(res);

			if (res.ok) {
				return toProfessor(res.rawData.dados);
			}
		} catch (e) {
			console.log(e);
		}

		return data;
	}

	static async activate(id: number, auth: User): Promise<boolean> {
		const req: AbstractQueryObject = this.routes.ACTIVATE;
		req.path![1] = String(id);
		req.credentials = auth;

		try {
			const res = await this.module.request(req);

			console.log(res);

			return res.ok;
		} catch (e) {
			console.log(e);
			return false;
		}
	}

	static async deactivate(id: number, auth: User): Promise<boolean> {
		const req: AbstractQueryObject = this.routes.DEACTIVATE;
		req.path![1] = String(id);
		req.credentials = auth;

		try {
			const res = await this.module.request(req);

			console.log(res);

			return res.ok;
		} catch (e) {
			console.log(e);
			return false;
		}
	}
}
