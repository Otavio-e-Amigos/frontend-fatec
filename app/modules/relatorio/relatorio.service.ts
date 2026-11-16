import type AbstractQueryObject from "../api/base/AbstractQueryObject";
import type { QueryArgumentObject } from "../api/base/AbstractQueryObject";
import DefaultAPIData from "../api/modules/default/DefaultAPIData";
import { DefaultAPIModule } from "../api/modules/default/DefaultAPIModule";
import type User from "../user/user.class";
import relatorioAPIRoutes from "./api/relatorio.routes";
import type {
	FormatoRelatorio,
	RelatorioExtracaoGrade,
	RelatorioFiltro,
	RelatorioFolhaPonto,
	TipoRelatorio,
} from "./relatorio.types";

/** Monta ?periodo=&data=&professorId= (professorId só vai quando informado). */
function toArguments(filtro: RelatorioFiltro, formato?: FormatoRelatorio) {
	const args: QueryArgumentObject[] = [
		{ param: "periodo", value: filtro.periodo },
		{ param: "data", value: filtro.data },
	];
	if (filtro.professorId) {
		args.push({ param: "professorId", value: filtro.professorId });
	}
	if (formato) args.push({ param: "formato", value: formato });
	return args;
}

export default class RelatorioService {
	static routes: typeof relatorioAPIRoutes = relatorioAPIRoutes;
	static module: DefaultAPIModule = new DefaultAPIModule();

	static async extracaoGrades(
		filtro: RelatorioFiltro,
		auth: User,
	): Promise<RelatorioExtracaoGrade> {
		const req: AbstractQueryObject = {
			...this.routes.EXTRACOES_GRADE,
			arguments: toArguments(filtro),
			credentials: auth,
		};
		const res = await this.module.request(req);
		return res.rawData.dados ?? res.rawData;
	}

	static async folhasPonto(
		filtro: RelatorioFiltro,
		auth: User,
	): Promise<RelatorioFolhaPonto> {
		const req: AbstractQueryObject = {
			...this.routes.FOLHAS_PONTO,
			arguments: toArguments(filtro),
			credentials: auth,
		};
		const res = await this.module.request(req);
		return res.rawData.dados ?? res.rawData;
	}

	/** Baixa o PDF ou DOCX do relatório, com exatamente os filtros informados. */
	static async exportar(
		tipo: TipoRelatorio,
		filtro: RelatorioFiltro,
		formato: FormatoRelatorio,
		auth: User,
	): Promise<void> {
		const route =
			tipo === "EXTRACAO_GRADE"
				? this.routes.EXTRACOES_GRADE_EXPORTAR
				: this.routes.FOLHAS_PONTO_EXPORTAR;
		const req: AbstractQueryObject = {
			...route,
			arguments: toArguments(filtro, formato),
			credentials: auth,
		};

		let blob: Blob;
		try {
			const res = await this.module.request(req);
			blob = res.rawData as Blob;
		} catch (e) {
			// Com responseType "blob", o corpo do erro também chega como Blob:
			// converte para JSON para a mensagem da API poder ser exibida.
			if (e instanceof DefaultAPIData && e.rawData instanceof Blob) {
				try {
					e.rawData = JSON.parse(await e.rawData.text());
				} catch {
					// corpo sem JSON: mantém o erro como está
				}
			}
			throw e;
		}

		const nome = tipo === "EXTRACAO_GRADE" ? "extracoes-grade" : "folhas-ponto";
		const filename = `relatorio-${nome}-${filtro.periodo.toLowerCase()}-${filtro.data}.${formato.toLowerCase()}`;

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
