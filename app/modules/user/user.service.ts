// import type { AbstractAPIDataInit } from "../api/base/AbstractAPIData";
import type AbstractQueryObject from "../api/base/AbstractQueryObject";
import { DefaultAPIModule } from "../api/modules/default/DefaultAPIModule";
import mapper from "./api/user.mapper";
import userAPIRoutes from "./user.apiRoutes";
import User, { type UserInterface } from "./user.class";

export default class UserService {
	static routes = userAPIRoutes;
	static module = new DefaultAPIModule();

	static async get(auth: User): Promise<User[]>;
	static async get(id: number, auth: User): Promise<User>;
	static async get(
		_id?: number | User,
		_auth?: User,
	): Promise<User[] | User | undefined> {
		const hasId: boolean = typeof _id === "number";
		const id: number | undefined = typeof _id === "number" ? _id : undefined;
		const auth: User | undefined =
			_auth instanceof User ? _auth : (_id as User);

		const req: AbstractQueryObject = id
			? this.routes.GET_BY_ID
			: this.routes.GET_ALL;
		req.credentials = auth;
		if (id) req.path![1] = id;

		try {
			const res = await this.module.request(req);
			console.log(res);
			if (res.ok) {
				if (hasId) {
					const usrInit: UserInterface = {
						id: res.rawData.dados.id,
						name: res.rawData.dados.nome,
						login: res.rawData.dados.login,
						profile: res.rawData.dados.perfil,
						active: res.rawData.dados.ativo,
						createdAt: res.rawData.dados.createdAt,
						updatedAt: res.rawData.dados.updatedAt,
					};
					return new User(usrInit);
				} else {
					return res.rawData.dados.map(mapper);
				}
			}
		} catch (e) {
			console.log(e);
		}

		// get data from APIModule, whether an id is declared or not
		// 	if found by id, return Professor found by id
		// 		if no professor has been found with that id, throws NotFoundError(404, "No professor")
		// 	if no id is provided, return Professor[], no matter if is empty or not
		// return prof;
	}

	static async edit(id: number, data: User, auth: User): Promise<User> {
		const form = {
			nome: data.name,
			novaSenha: data.password,
		};

		const req: AbstractQueryObject = this.routes.EDIT;
		req.body = form;
		req.path![1] = id;
		req.credentials = auth;

		try {
			const res = await this.module.request(req);
			console.log(res);
			if (res.ok) {
				console.log("user edited!");
				const usrInit: UserInterface = {
					id: res.rawData.dados.id,
					name: res.rawData.dados.nome,
					login: res.rawData.dados.login,
					profile: res.rawData.dados.perfil,
					active: res.rawData.dados.ativo,
					createdAt: res.rawData.dados.createdAt,
					updatedAt: res.rawData.dados.updatedAt,
				};
				return new User(usrInit);
			}
		} catch (e) {
			console.log(e);
		}

		//parse data to defined schema by API route
		// send request to API through DefaultAPIModule (apply MockAPIModule here when on development mode?)
		// if success (2xx), returns edited object with extra parameters to caller
		// if error (4xx/5xx), throws corresponding error messages
		return data;
	}

	static async save(data: User, auth: User): Promise<User> {
		// console.log("saving user!");
		// console.log("checking user credentials!");
		// console.log(auth);

		const form = {
			nome: data.name,
			senha: data.password,
			perfil: data.profile,
		};

		const req: AbstractQueryObject = this.routes.SAVE;
		req.body = form;
		req.credentials = auth;

		// const dataInit: AbstractAPIDataInit = {
		// 	status: 200,
		// 	ok: true,
		// 	data: undefined,
		// };

		try {
			const res = await this.module.request(req);
			console.log(res);
			if (res.ok) {
				const usrInit: UserInterface = {
					id: res.rawData.dados.id,
					name: res.rawData.dados.nome,
					login: res.rawData.dados.login,
					profile: res.rawData.dados.perfil,
					active: res.rawData.dados.ativo,
					createdAt: res.rawData.dados.createdAt,
					updatedAt: res.rawData.dados.updatedAt,
				};
				return new User(usrInit);
			}
		} catch (e) {
			console.log(e);
		}

		//parse data to defined schema by API route
		// send request to API through DefaultAPIModule (apply MockAPIModule here when on development mode?)
		// if success (2xx), returns newly created object to caller
		// if error (4xx/5xx), throws corresponding error messages
		return data;
	}

	static async activate(id: number, auth: User): Promise<boolean> {
		const req: AbstractQueryObject = this.routes.ACTIVATE;
		req.path![1] = id;
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
		req.path![1] = id;
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
