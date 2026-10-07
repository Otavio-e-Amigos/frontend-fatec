import { DefaultAPIModule } from "../api/modules/default/DefaultAPIModule";
import type AbstractQueryObject from "../api/base/AbstractQueryObject";
import User from "../user/user.class";
import PeriodoLetivo from "./periodo-letivo.class";
const map = (item: any) =>
    !item ? undefined : new PeriodoLetivo({
        id: item.id,
        semestre: item.semestre,
        ano: item.ano,
        dataInicio: item.dataInicio ?? item.data_inicio,
        dataFim: item.dataFim ?? item.data_fim,
    });

export default class PeriodoLetivoService {
    static module = new DefaultAPIModule();

    static async get(auth: User): Promise<PeriodoLetivo[]>;
    static async get(id: number, auth: User): Promise<PeriodoLetivo | undefined>;
    static async get(idOrAuth: number | User, maybeAuth?: User) {
        const id = typeof idOrAuth === "number" ? idOrAuth : undefined;
        const auth = typeof idOrAuth === "number" ? maybeAuth! : idOrAuth;

        const req: AbstractQueryObject = {
            method: "GET",
            path: id ? ["periodos-letivos", id] : ["periodos-letivos"],
            credentials: auth,
        };
        const res = await this.module.request(req);
        if (!res.ok) return id ? undefined : [];

        if (id) return map(res.rawData.dados ?? res.rawData);
        const items = res.rawData.content ?? res.rawData.dados ?? (Array.isArray(res.rawData) ? res.rawData : []);
        return items.map(map).filter(Boolean);
    }

    static async save(data: PeriodoLetivo, auth: User) {
        if (![1, 2].includes(Number(data.semestre) ?? 0))
            throw new Error("Semestre deve ser 1 ou 2.");
        if (!/^\d{4}$/.test(String(data.ano)))
            throw new Error("Ano deve ter quatro dígitos.");
        if (!data.dataInicio || !data.dataFim || data.dataInicio >= data.dataFim)
            throw new Error("A data inicial deve ser anterior à final.");
        const req: AbstractQueryObject = {
            method: "POST",
            path: ["periodos-letivos"],
            credentials: auth,
            body: {
                semestre: Number(data.semestre),
                ano: Number(data.ano),
                dataInicio: data.dataInicio,
                dataFim: data.dataFim,
            },
        };
        const res = await this.module.request(req);
        return res.ok ? map(res.rawData.dados ?? res.rawData) : undefined;
    }
}
