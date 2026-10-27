import type AbstractQueryObject from "../api/base/AbstractQueryObject";
import DefaultAPIData from "../api/modules/default/DefaultAPIData";
import { DefaultAPIModule } from "../api/modules/default/DefaultAPIModule";
import type User from "../user/user.class";
import folhaPontoRoutes from "./api/folha-ponto.routes";
import { fromApi, toApi } from "./api/folha-ponto.mapper";
import type { GradeExtraida } from "./folha-ponto.types";

export default class FolhaPontoService {
	static module = new DefaultAPIModule();

	private static async request(
		request: AbstractQueryObject,
		auth: User,
	): Promise<DefaultAPIData> {
		try {
			return await this.module.request({ ...request, credentials: auth });
		} catch (error) {
			// o módulo lança DefaultAPIData em erros HTTP; usamos a mensagem do Back
			if (error instanceof DefaultAPIData) {
				const message = error.rawData?.mensagem;
				if (typeof message === "string" && message.trim()) {
					throw new Error(message);
				}
				throw new Error("Não foi possível concluir a operação. Tente novamente.");
			}
			throw error;
		}
	}

	/** Envia o PDF da grade e devolve os dados extraídos (com avisos). */
	static async extrair(arquivo: File, auth: User): Promise<GradeExtraida> {
		const body = new FormData();
		body.append("arquivo", arquivo); // nome do campo esperado pelo Back
		const response = await this.request(
			{ ...folhaPontoRoutes.EXTRAIR, body, timeout: 90_000 },
			auth,
		);
		return fromApi(response.rawData?.dados);
	}

	/** Valida e normaliza os dados corrigidos. Lança Error com a mensagem do Back (400). */
	static async validar(dados: GradeExtraida, auth: User): Promise<GradeExtraida> {
		const response = await this.request(
			{ ...folhaPontoRoutes.VALIDAR, body: toApi(dados) },
			auth,
		);
		return fromApi(response.rawData?.dados);
	}
}