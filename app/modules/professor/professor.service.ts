import type AbstractQueryObject from "../api/base/AbstractQueryObject";
import { DefaultAPIModule } from "../api/modules/default/DefaultAPIModule";
import Professor from "./professor.class";
import User from "../user/user.class";

// Único lugar que monta o Professor a partir da resposta da API.
// A API não retorna "cpf", então usamos "" para não deixar undefined.
function toProfessor(prof: any): Professor {
	return new Professor(
		prof.nome,
		prof.cpf ?? "",
		prof.matricula ?? "",
		prof.regimeContrato ?? "",
		prof.status ?? "",
		prof.titulacao ?? "",
		prof.codigo ?? "",
		prof.id
	);
}

export default class ProfessorService {
	static async get(auth: User): Promise<Professor[]>;
	static async get(id: number, auth: User): Promise<Professor>;

	static async get(
		idOrAuth: number | User,
		maybeAuth?: User
	): Promise<Professor[] | Professor | undefined> {

		const id = typeof idOrAuth === "number" ? idOrAuth : undefined;
		const auth = typeof idOrAuth === "number" ? maybeAuth : idOrAuth;

		const req: AbstractQueryObject = {
			method: "GET",
			path: id !== undefined ? ["professores", id] : ["professores"],
			credentials: auth,
		};

		// ... o resto continua igual (try/catch, toProfessor etc.)

		const module = new DefaultAPIModule();

		try {
			const res = await module.request(req);

			console.log(res);

			if (res.ok) {

				if (typeof id === "number") {
					return toProfessor(res.rawData.dados);
				}

				return res.rawData.dados.map(toProfessor);
			}

		} catch (e) {
			console.log(e);
		}
	}

	static async edit(
		id: number,
		data: Professor,
		auth: User
	): Promise<Professor> {

		const form: any = {
			nome: data.name,
			cpf: data.cpf,
			matricula: data.registry,
			regimeContrato: data.contract,
			status: data.status,
			titulacao: data.title,
			codigo: data.code,
		};

		const req: AbstractQueryObject = {
			method: "PUT",
			body: form,
			path: ["professores", id],
			credentials: auth,
		};

		const module = new DefaultAPIModule();

		try {
			const res = await module.request(req);

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

	static async save(
		data: Professor,
		auth: User
	): Promise<Professor> {

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

		const req: AbstractQueryObject = {
			method: "POST",
			body: form,
			path: ["professores"],
			credentials: auth,
		};

		const module = new DefaultAPIModule();

		try {
			const res = await module.request(req);

			console.log(res);

			if (res.ok) {
				return toProfessor(res.rawData.dados);
			}

		} catch (e) {
			console.log(e);
		}

		return data;
	}

	static async activate(
		id: number,
		auth: User
	): Promise<boolean> {

		const req: AbstractQueryObject = {
			method: "PATCH",
			path: ["professores", id, "ativar"],
			credentials: auth,
		};

		const module = new DefaultAPIModule();

		try {
			const res = await module.request(req);

			console.log(res);

			return res.ok;

		} catch (e) {
			console.log(e);
			return false;
		}
	}

	static async deactivate(
		id: number,
		auth: User
	): Promise<boolean> {

		const req: AbstractQueryObject = {
			method: "PATCH",
			path: ["professores", id, "desativar"],
			credentials: auth,
		};

		const module = new DefaultAPIModule();

		try {
			const res = await module.request(req);

			console.log(res);

			return res.ok;

		} catch (e) {
			console.log(e);
			return false;
		}
	}
}