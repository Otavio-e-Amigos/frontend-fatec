import { DefaultAPIModule } from "../api/modules/default/DefaultAPIModule";
import type AbstractQueryObject from "../api/base/AbstractQueryObject";
import DefaultAPIData from "../api/modules/default/DefaultAPIData";
import User from "../user/user.class";
import EventoCalendario from "./calendario.class";
import mapper from "./api/calendario.mapper";
import calendarioAPIRoutes from "./api/calendario.routes";
import { FormValidationError } from "~/classes/errors/ValidationError";

export default class CalendarioService {
	static module = new DefaultAPIModule();
	static routes: typeof calendarioAPIRoutes = calendarioAPIRoutes;

	/** Lista os eventos cadastrados (o Back já devolve ordenado por data). */
	static async get(auth: User): Promise<EventoCalendario[]> {
		const req: AbstractQueryObject = { ...this.routes.GET_ALL, credentials: auth };
		const res = await this.module.request(req);
		if (!res.ok) return [];

		const items = res.rawData.dados ?? (Array.isArray(res.rawData) ? res.rawData : []);
		return items.map(mapper);
	}

	/**
	 * Cria (POST) ou atualiza (PUT /calendario/{data}).
	 * `isEdit` indica atualização; nesse caso a data identifica o evento.
	 */
	static async save(data: EventoCalendario, auth: User, isEdit = false) {
		const req: AbstractQueryObject = isEdit
			? { ...this.routes.UPDATE, path: ["calendario", data.data], credentials: auth }
			: { ...this.routes.SAVE, credentials: auth };

		req.body = {
			data: data.data,
			descricao: data.descricao?.trim(),
			tipo: data.tipo,
			semAula: data.semAula,
		};

		try {
			const res = await this.module.request(req);
			return res.ok ? mapper(res.rawData.dados ?? res.rawData) : undefined;
		} catch (e) {
			if (e instanceof DefaultAPIData) {
				const message = e.rawData?.mensagem;
				// o Back responde 400 para data duplicada e para evento inexistente
				if (e.status === 400 || e.status === 401 || e.status === 409) {
					throw new FormValidationError(message ?? "Erro de validação", [message]);
				}
				throw new Error(message ?? "Erro ao salvar dados");
			}
			throw e;
		}
	}

	static async delete(data: string, auth: User): Promise<boolean> {
		const req: AbstractQueryObject = {
			...this.routes.DELETE,
			path: ["calendario", data],
			credentials: auth,
		};
		try {
			const res = await this.module.request(req);
			return res.ok;
		} catch (error) {
			if (error instanceof DefaultAPIData) {
				const message = error.rawData?.mensagem;
				if (typeof message === "string" && message.trim()) {
					throw new Error(message);
				}
			}
			throw error;
		}
	}
}
