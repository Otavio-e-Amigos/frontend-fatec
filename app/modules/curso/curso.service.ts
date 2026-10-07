import type AbstractQueryObject from "../api/base/AbstractQueryObject";
import { DefaultAPIModule } from "../api/modules/default/DefaultAPIModule";
import User from "../user/user.class";
import toCurso from "./api/curso.mapper";
import Curso from "./curso.class";
import cursoAPIRoutes from "./curso.apiRoutes";

export default class CursoService {
    static module = new DefaultAPIModule();

    static async get(auth: User): Promise<Curso[]>;

    static async get(id: number, auth: User): Promise<Curso | undefined>;

    static async get(idOrAuth: number | User, maybeAuth?: User) {
        const id = typeof idOrAuth === "number" ? idOrAuth : undefined;
        const auth = typeof idOrAuth === "number" ? maybeAuth! : idOrAuth;
        const route = id ? cursoAPIRoutes.GET_BY_ID : cursoAPIRoutes.GET_ALL;
        const req: AbstractQueryObject = {
            ...route,
            path: [...route.path],
            credentials: auth,
        };

        if (id) req.path![1] = id;
        const res = await this.module.request(req);
        if (!res.ok) return id ? undefined : [];

        if (id) return toCurso(res.rawData.dados ?? res.rawData);
        const items = res.rawData.content ?? res.rawData.dados ?? (Array.isArray(res.rawData) ? res.rawData : []);
        return items.map(toCurso).filter((c: Curso | undefined): c is Curso => c !== undefined);
    }

    static async save(data: Curso, auth: User): Promise<Curso | undefined> {
        return this.write(cursoAPIRoutes.SAVE, data, auth);
    }

    static async edit(id: number, data: Curso, auth: User): Promise<Curso | undefined> {
        return this.write(cursoAPIRoutes.EDIT, data, auth, id);
    }

    private static async write(route: typeof cursoAPIRoutes.SAVE | typeof cursoAPIRoutes.EDIT, data: Curso, auth: User, id?: number) {
        const req: AbstractQueryObject = {
            ...route,
            path: id ? ["cursos", id] : ["cursos"],
            body: { nome: data.nome?.trim(), turno: data.turno?.trim(), sigla: data.sigla?.trim() },
            credentials: auth,
        };
        const res = await this.module.request(req);
        return res.ok ? (toCurso(res.rawData.dados ?? res.rawData) ?? new Curso({ id: res.rawData.id ?? id, nome: data.nome, turno: data.turno, sigla: data.sigla })) : undefined;
    }

}