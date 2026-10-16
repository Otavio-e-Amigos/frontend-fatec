import {
	// APIValidationError,
	FormValidationError,
} from "~/classes/errors/ValidationError";
import type AbstractQueryObject from "../api/base/AbstractQueryObject";
import { DefaultAPIModule } from "../api/modules/default/DefaultAPIModule";
import authAPIRoutes from "./api/auth.routes";
import User, { type UserInterface } from "./user.class";
// import { data } from "react-router";
// import AbstractAPIData from "../api/base/AbstractAPIData";
import DefaultAPIData from "../api/modules/default/DefaultAPIData";

export default class AuthService {
	static module: DefaultAPIModule = new DefaultAPIModule();
	static routes: typeof authAPIRoutes = authAPIRoutes;

	static async login(username: string, password: string): Promise<boolean> {
		const req: AbstractQueryObject = this.routes.LOGIN;
		req.body = {
			login: username,
			senha: password,
		};

		try {
			const res = await this.module.request(req);
			// console.log("<AuthService> is it logged in?");
			// console.log(res);

			const init: UserInterface = {
				id: res.rawData.dados?.id,
				name: res.rawData.dados?.nome,
				profile: res.rawData.dados?.perfil,
				token: res.rawData.dados?.token,
			};
			const user = new User(init);

			localStorage.setItem("auth", JSON.stringify(user));
			return true;
		} catch (e) {
			// console.error(e);
			if (e instanceof DefaultAPIData) {
				const message = e.rawData.mensagem;
				switch (e.status) {
					case 400:
					case 401:
						throw new FormValidationError(
							message ?? "Usuário ou senha inválidos. Verifique e tente novamente.",
							[
								{
									name: "pass",
									message:
										message ?? "Usuário ou senha inválidos. Verifique e tente novamente.",
								},
							],
						);
					default:
						throw new Error("An error occurred while logging in");
				}
			}
			throw e;
		}
		return false;
	}

	static getUserToken(): User {
		if (typeof window === "undefined") {
			throw new Error("A sessão só pode ser lida no navegador.");
		}

		const storedAuth = window.localStorage.getItem("auth");
		if (!storedAuth) {
			throw new Error("Não há uma sessão autenticada neste dispositivo.");
		}

		const auth = new User(JSON.parse(storedAuth) as UserInterface);
		return auth;
	}

	// TODO check API routes for authentication and implement it here

	static async isLoggedIn(): Promise<boolean> {
		// TODO: Implement isLoggedIn
		return false;
	}

	static hasUserToken(): boolean {
		return (
			typeof window !== "undefined" &&
			window.localStorage.getItem("auth") !== null
		);
	}
}
