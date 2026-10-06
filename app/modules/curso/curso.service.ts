import type AbstractQueryObject from "../api/base/AbstractQueryObject";
import { DefaultAPIModule } from "../api/modules/default/DefaultAPIModule";

import Curso from "./curso.class";
import cursoAPIroutes from "./curso.apiRoutes";
import type User from "../user/user.class";


function toCurso(curso: any): Curso {
	return new Curso({
        id: curso.id,
        name: curso.name,
        shift: curso.shift,
        unit: curso.unit,
        acronym: curso.acronym
      
    });
}

export default class CursoService {
    static routes: typeof cursoAPIroutes = cursoAPIroutes;
	static module: DefaultAPIModule = new DefaultAPIModule();
    
    static async get(auth: User): Promise<Curso[]>;
    static async get(id: number, auth: User): Promise<Curso>;
    static async get(
                idOrAuth: number | User,
                maybeAuth?: User,
            ): Promise<Curso[] | Curso | undefined> {
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
                        return toCurso(res.rawData.dados);
                    }
    
                    return res.rawData.dados.map(toCurso);
                }
            } catch (e) {
                console.log(e);
            }
        }


        static async edit(
                id: number,
                data: Curso,
                auth: User,
            ): Promise<Curso> {
                const form: any = {
                    nome: data.name,
                    turno: data.shift,
                    unidade: data.unit,
                    sigla: data.acronym,
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
        
                        return toCurso(res.rawData.dados);
                    }
                } catch (e) {
                    console.log(e);
                }
        
                return data;
            }

            static async save(data: Curso, auth: User): Promise<Curso> {
                    console.log("saving course!");
                    console.log("checking user credentials!");
                    console.log(auth);
            
                    const form = {
                        nome: data.name,
                        turno: data.shift,
                        unidade: data.unit,
                        sigla: data.acronym,
                    };
            
                    const req: AbstractQueryObject = {
                        method: "POST",
                        body: form,
                        path: ["cursos"],
                        credentials: auth,
                    };
            
                    //const module = new DefaultAPIModule();
            
                    try {
                        const res = await this.module.request(req);
            
                        console.log(res);
            
                        if (res.ok) {
                            return toCurso(res.rawData.dados);
                        }
                    } catch (e) {
                        console.log(e);
                    }
            
                    return data;
                }
        

    
}