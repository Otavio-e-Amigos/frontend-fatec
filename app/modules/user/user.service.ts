// import { useContext } from "react";
import type { AbstractAPIDataInit } from "../api/base/AbstractAPIData";
import type AbstractQueryObject from "../api/base/AbstractQueryObject";
// import DefaultAPIData from "../api/modules/default/DefaultAPIData";
import { DefaultAPIModule } from "../api/modules/default/DefaultAPIModule";
import User, { type UserInterface } from "./user.class";
// import { AuthUserContext } from "./components/AuthenticationService";

export default class UserService {
	static async get(auth: User): Promise<User[]>;
	static async get(id: number, auth: User): Promise<User>;
	static async get(
		id?: number | User,
		auth?: User,
	): Promise<User[] | User | undefined> {
		// const usrInit: UserInterface = {
		// 	name: "",
		// 	login: "",
		// 	profile: "TI",
		// 	active: false,
		// 	createdAt: "",
		// 	updatedAt: "",
		// };
		// const prof = new User(usrInit);
		const req: AbstractQueryObject = {
			method: "GET",
			path: typeof id === "number" ? ["usuarios", id] : ["usuarios"],
			credentials: auth ?? id,
		};

		const module = new DefaultAPIModule();

		try {
			const res = await module.request(req);
			console.log(res);
			if (res.ok) {
				if (typeof id === "number") {
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
					return res.rawData.dados.map(
						(user:any) =>
							new User({
								id: user.id,
								name: user.nome,
								login: user.login,
								profile: user.perfil,
								active: user.ativo,
								createdAt: user.createdAt,
								updatedAt: user.updatedAt,
							}),
					);
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

		const req: AbstractQueryObject = {
			method: "PUT",
			body: form,
			path: ["usuarios", id],
			credentials: auth,
		};

		const module = new DefaultAPIModule();

		try {
			const res = await module.request(req);
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

	static async save(data: User, credentials: User): Promise<User> {
		console.log("saving user!");
		console.log("checking user credentials!");
		console.log(credentials);

		const form = {
			nome: data.name,
			senha: data.password,
			perfil: data.profile,
		};

		const req: AbstractQueryObject = {
			method: "POST",
			body: form,
			path: ["usuarios"],
			credentials: credentials,
		};

		const dataInit: AbstractAPIDataInit = {
			status: 200,
			ok: true,
			data: undefined,
		};

		const module = new DefaultAPIModule();

		try {
			const res = await module.request(req);
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
			// const data = new DefaultAPIData(dataInit)
		} catch (e) {
			console.log(e);
		}

		//parse data to defined schema by API route
		// send request to API through DefaultAPIModule (apply MockAPIModule here when on development mode?)
		// if success (2xx), returns newly created object to caller
		// if error (4xx/5xx), throws corresponding error messages
		return data;
	}

	static async delete(id: number): Promise<boolean> {
		//sends request through APIModule to delete Professor #{id}
		// if deleted, returns true
		// if not found, returns NotFoundError (or return false?)
		// if it cant be deleted by some astral reason, return false
		return true;
	}

	static async activate(id: number, auth: User): Promise<boolean> {
		const req: AbstractQueryObject = {
			method: "PATCH",
			path: ["usuarios", id, "ativar"],
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

	static async deactivate(id: number, auth: User): Promise<boolean> {
		const req: AbstractQueryObject = {
			method: "PATCH",
			path: ["usuarios", id, "desativar"],
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
