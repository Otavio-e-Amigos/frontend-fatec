import type AbstractQueryObject from "../api/base/AbstractQueryObject";
import { DefaultAPIModule } from "../api/modules/default/DefaultAPIModule";
import type User from "../user/user.class";
import notificacaoAPIRoutes from "./api/notificacao.routes";
import type { Notificacao, NotificacaoContagem } from "./notificacao.types";

export default class NotificacaoService {
	static module = new DefaultAPIModule();
	static routes = notificacaoAPIRoutes;

	/** Últimas notificações do usuário logado (mais recentes primeiro). */
	static async listar(auth: User, size = 10): Promise<Notificacao[]> {
		const req: AbstractQueryObject = {
			...this.routes.GET_ALL,
			arguments: [
				{ param: "page", value: 0 },
				{ param: "size", value: size },
			],
			credentials: auth,
		};
		const res = await this.module.request(req);
		const page = res.rawData?.dados ?? res.rawData;
		return page?.content ?? [];
	}

	/** Números do sininho: não lidas e pendências abertas. */
	static async contagem(auth: User): Promise<NotificacaoContagem> {
		const req: AbstractQueryObject = { ...this.routes.CONTAGEM, credentials: auth };
		const res = await this.module.request(req);
		const data = res.rawData?.dados ?? res.rawData;
		return { naoLidas: data?.naoLidas ?? 0, pendentes: data?.pendentes ?? 0 };
	}

	static async marcarLida(id: number, auth: User): Promise<void> {
		const req: AbstractQueryObject = {
			...this.routes.MARCAR_LIDA,
			path: ["notificacoes", id, "lida"],
			credentials: auth,
		};
		await this.module.request(req);
	}

	static async marcarTodasLidas(auth: User): Promise<void> {
		const req: AbstractQueryObject = { ...this.routes.MARCAR_TODAS_LIDAS, credentials: auth };
		await this.module.request(req);
	}
}
