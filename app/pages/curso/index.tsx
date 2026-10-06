import { useState } from "react";
import { Form, Link, useNavigate } from "react-router";
import DefaultTableModel from "~/classes/TableModels/DefaultTableModel";
import FormInput from "~/components/forms/FormInput";
import ComplexTableModelView from "~/components/tables/ComplexTableView";
import Header from "~/layouts/Header";
import PageSection from "~/layouts/PageSection.layout";
import type Curso from "~/modules/curso/curso.class";

import User from "~/modules/user/user.class";

export default function Page({ list }: { list: Curso[] }) {
    // TODO test and switch with ObjectTableModel
    //
    //
    const navigate = useNavigate();
    const auth = new User(JSON.parse(localStorage.getItem("auth") as string));
    // const [professorsTableList, setProfessorsTableList] = useState(setList(list));

    const [CourseTable, setCourseTable] = useState(setList(list));

    function setList(list: Array<any>) {
        const mapper = () => {
            return list.map((curso) => [
                {
                    value: curso.name,
                    display: (
                        <Link key={curso.id} className="link" to={`/curso/${curso.id}`}>
                            {curso.name}
                        </Link>
                    ),
                },
                curso.shitf,
                curso.unit,
                curso.acronym,
                {
                    value: 0,
                    display: (
                        <div key={curso.id} className="flex flex-row gap-2 justify-center">
                          
                            <Link
                                className="btn btn-normal"
                                to={`/curso/${curso.id}/edit`}
                            >
                                Editar
                            </Link>
                        </div>
                    ),
                },
            ]);
        };

        return new DefaultTableModel(mapper(), [
            "Curso",
            "Nome",
            "Turno",
            "Unidade",
            "Sigla",
        ]);
    }

    // const professorsTable = new DefaultTableModel(setList(list), [
    // 	"Docente",
    // 	"Matrícula",
    // 	"Tipo de Contrato",
    // 	"Status",
    // 	"Ação",
    // ]);

  /*   function searchItem(value: string) {
       setCourseTable(
            setList(list.filter((curso) => curso.name.includes(value) == true)),
        );

        console.log(CourseTable);
    }*/
        return (
            <div className="flex flex-col flex-1">
                <Header activeItem="Curso" />

                <main className="mx-5 flex flex-1 flex-col">
                    <section className="flex flex-row justify-between items-center">
                        <PageSection name={"Curso"} />
                        <Link to="add" className="btn btn-success h-fit">
                            + Adicionar
                        </Link>
                    </section>
                    <section className="flex flex-row my-4 justify-end">
                        <FormInput
                            type="search"
                            name={"search"}
                            onChange={(a: any) => {
                                // if this doesnt work, FormInput may have it's variable onChange commented for some reason
                                //searchItem(a.currentTarget.value);
                            }}
                        />
                    </section>
                    <ComplexTableModelView data={CourseTable} />
                </main>
            </div>
        );
    }
