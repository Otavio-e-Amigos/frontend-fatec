import type AbstractQueryObject from "../api/base/AbstractQueryObject";
import DefaultAPIData from "../api/modules/default/DefaultAPIData";
import { DefaultAPIModule } from "../api/modules/default/DefaultAPIModule";
import type User from "../user/user.class";
import mapper from "./api/folha-ponto.mapper";
import folhaPontoAPIRoutes from "./api/folha-ponto.routes";
import type FolhaPontoPreview from "./folha-ponto.class";
import type { FolhaPontoRequest } from "./folha-ponto.class";

export default class FolhaPontoService {
	static routes: typeof folhaPontoAPIRoutes = folhaPontoAPIRoutes;
	static module: DefaultAPIModule = new DefaultAPIModule();

	/** Busca os dados estruturados da folha para conferência (nada é gerado). */
	static async preview(
		data: FolhaPontoRequest,
		auth: User,
	): Promise<FolhaPontoPreview> {
		const req: AbstractQueryObject = {
			...this.routes.PREVIEW,
			body: data,
			credentials: auth,
		};

		const res = await this.module.request(req);
		return mapper(res.rawData.dados ?? res.rawData);
	}

	/** Gera o .docx oficial na API e dispara o download no navegador. */
	static async download(data: FolhaPontoRequest, auth: User): Promise<void> {
		const req: AbstractQueryObject = {
			...this.routes.GENERATE,
			body: data,
			credentials: auth,
		};

		let blob: Blob;
		try {
			const res = await this.module.request(req);
			blob = res.rawData as Blob;
		} catch (e) {
			// Com responseType "blob", o corpo do erro também chega como Blob.
			// Converte para JSON para que a mensagem da API possa ser exibida.
			if (e instanceof DefaultAPIData && e.rawData instanceof Blob) {
				try {
					e.rawData = JSON.parse(await e.rawData.text());
				} catch {
					// corpo sem JSON: mantém o erro como está
				}
			}
			throw e;
		}

		const mes = String(data.mes).padStart(2, "0");
		const filename = `Folha_de_Ponto_Professor_${data.professorId}_${mes}_${data.ano}.docx`;

		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		link.remove();
		URL.revokeObjectURL(url);
	}
}