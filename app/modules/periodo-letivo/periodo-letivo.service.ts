import { DefaultAPIModule } from "../api/modules/default/DefaultAPIModule";
import type AbstractQueryObject from "../api/base/AbstractQueryObject";
import User from "../user/user.class";
import PeriodoLetivo from "./periodo-letivo.class";
import mapper from "./api/periodo-letivo.mapper";
import periodosLetivosAPIRoutes from "./api/periodo-letivo.routes";
import DefaultAPIData from "../api/modules/default/DefaultAPIData";
import { FormValidationError } from "~/classes/errors/ValidationError";

export default class PeriodoLetivoService {
	static module = new DefaultAPIModule();
	static routes: typeof periodosLetivosAPIRoutes = periodosLetivosAPIRoutes;

	static async get(auth: User): Promise<PeriodoLetivo[]>;
	static async get(id: number, auth: User): Promise<PeriodoLetivo | undefined>;
	static async get(idOrAuth: number | User, maybeAuth?: User) {
		const id = typeof idOrAuth === "number" ? idOrAuth : undefined;
		const auth = typeof idOrAuth === "number" ? maybeAuth! : idOrAuth;

		const req: AbstractQueryObject = id
			? { ...this.routes.GET_BY_ID, path: ["periodos-letivos", id] }
			: { ...this.routes.GET_ALL };
		req.credentials = auth;

		let res: DefaultAPIData;
		try {
			res = await this.module.request(req);
		} catch (error) {
			if (id && error instanceof DefaultAPIData && error.status === 404) {
				return undefined;
			}
			throw error;
		}
		if (!res.ok) return id ? undefined : [];

		if (id) return mapper(res.rawData.dados ?? res.rawData);
		const items =
			res.rawData.content ??
			res.rawData.dados ??
			(Array.isArray(res.rawData) ? res.rawData : []);
		return items.map(mapper).filter(Boolean);
	}

	static async save(data: PeriodoLetivo, auth: User) {
		// TODO include validators on form fields itself
		// if (![1, 2].includes(Number(data.semestre) ?? 0))
		// 	throw new Error("Semestre deve ser 1 ou 2.");
		// if (!/^\d{4}$/.test(String(data.ano)))
		// 	throw new Error("Ano deve ter quatro dígitos.");
		// if (!data.dataInicio || !data.dataFim || data.dataInicio >= data.dataFim)
		// 	throw new Error("A data inicial deve ser anterior à final.");

		const req: AbstractQueryObject = data.id
			? {
					...this.routes.UPDATE,
					path: ["periodos-letivos", data.id],
					credentials: auth,
				}
			: { ...this.routes.SAVE, credentials: auth };
		req.body = {
			semestre: Number(data.semestre),
			ano: Number(data.ano),
			dataInicio: data.dataInicio,
			dataFim: data.dataFim,
		};

		try {
			const res = await this.module.request(req);
			return res.ok ? mapper(res.rawData.dados ?? res.rawData) : undefined;
		} catch (e) {
			console.error(e);
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
					case 409:
						throw new FormValidationError(message ?? "Conflito ao salvar período letivo", [
							message,
						]);
					default:
						throw new Error(message ?? "Erro ao salvar dados");
				}
			}
			throw e;
		}
	}
}
