import type AbstractQueryObject from "../api/base/AbstractQueryObject";
import { DefaultAPIModule } from "../api/modules/default/DefaultAPIModule";

import Disciplina from "./disciplina.class";
import disciplinaAPIRoutes from "./disciplina.apiRoutes";

import type User from "../user/user.class";


function toDiscplina(disciplina: any): Disciplina {
	return new Disciplina({
        id: disciplina.id,
        cod: disciplina.cod,
        acronym: disciplina.acronym,
        name: disciplina.name,
        
    });
}

export default class DisciplinaService {
    static routes: typeof disciplinaAPIRoutes = disciplinaAPIRoutes;
	static module: DefaultAPIModule = new DefaultAPIModule();
    
    static async get(auth: User): Promise<Disciplina[]>;
    static async get(id: number, auth: User): Promise<Disciplina>;
    static async get(
                idOrAuth: number | User,
                maybeAuth?: User,
            ): Promise<User[] | User | undefined> {
                const id = typeof idOrAuth === "number" ? idOrAuth : undefined;
                const auth = typeof idOrAuth === "number" ? maybeAuth : idOrAuth;

            const req: AbstractQueryObject = id
                ? this.routes.GET_BY_ID
                : this.routes.GET_ALL;
            req.credentials = auth;
            if (id) req.path![1] = 1;
            // const req: AbstractQueryObject = {
            // 	method: "GET",
            // 	path: id !== undefined ? ["professores", id] : ["professores"],
            // 	credentials: auth,
            // };
    
            // ... o resto continua igual (try/catch, toProfessor etc.)
    
            //const module = new DefaultAPIModule();
    
            try {
                const res = await this.module.request(req);
    
                console.log(res);
    
                if (res.ok) {
                    if (typeof id === "number") {
                        return toDiscplina(res.rawData.dados);
                    }
    
                    return res.rawData.dados.map(toDiscplina);
                }
            } catch (e) {
                console.log(e);
            }
        }


        static async edit(
                id: number,
                data: Disciplina,
                auth: User,
            ): Promise<Disciplina> {
                const form: any = {
                    codigo: data.cod,
                    sigla: data.acronym,
                    nome: data.name,  
                };
        
     
                const req = this.routes.EDIT;
                req.body = form;
                req.path[1] = String(id);
                req.credentials = auth as any;
        
                try {
                    const res = await this.module.request(req);
        
                    console.log(res);
        
                    if (res.ok) {
                        console.log("Course edited!");
        
                        return toDiscplina(res.rawData.dados);
                    }
                } catch (e) {
                    console.log(e);
                }
        
                return data;
            }

            static async save(data: Disciplina, auth: User): Promise<Disciplina> {
                    console.log("saving course!");
                    console.log("checking user credentials!");
                    console.log(auth);
            
                    const form = {
                        codigo: data.cod,
                        sigla: data.acronym,
                        nome: data.name,
                    };
            
                    const req: AbstractQueryObject = {
                        method: "POST",
                        body: form,
                        path: ["disciplinas"],
                        credentials: auth,
                    };
            
                    //const module = new DefaultAPIModule();
            
                    try {
                        const res = await this.module.request(req);
            
                        console.log(res);
            
                        if (res.ok) {
                            return toDiscplina(res.rawData.dados);
                        }
                    } catch (e) {
                        console.log(e);
                    }
            
                    return data;
                }
        
}