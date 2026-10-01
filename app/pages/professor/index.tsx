import { useState } from "react";
import { Form, Link, useNavigate } from "react-router";
import DefaultTableModel from "~/classes/TableModel/DefaultTableModel";
import FormInput from "~/components/forms/FormInput";
import ComplexTableModelView from "~/components/tables/ComplexTableView";
import Header from "~/layouts/Header";
import PageSection from "~/layouts/PageSection.layout";
import Professor from "~/modules/professor/professor.class";
import ProfessorService from "~/modules/professor/professor.service";
import User from "~/modules/user/user.class";

export default function Page({ list }: { list: Professor[] }) {
	// TODO test and switch with ObjectTableModel
	//
	//
	const navigate = useNavigate();
	const auth = new User(JSON.parse(localStorage.getItem("auth") as string));
	// const [professorsTableList, setProfessorsTableList] = useState(setList(list));

	const [professorsTable, setProfessorsTable] = useState(setList(list));

	async function activate(id: number) {
		const res = await ProfessorService.activate(id, auth);
		if (res) {
			navigate(0);
		}
	}

	async function deactivate(id: number) {
		const res = await ProfessorService.deactivate(id, auth);
		if (res) {
			navigate(0);
		}
	}

	function setList(list: Array<any>) {
		const mapper = () => {
			return list.map((prof) => [
				{
					value: prof.name,
					display: (
						<Link key={prof.id} className="link" to={`/professor/${prof.id}`}>
							{prof.name}
						</Link>
					),
				},
				prof.registry,
				prof.contract,
				prof.status,
				{
					value: 0,
					display: (
						<div key={prof.id} className="flex flex-row gap-2 justify-center">
							<button
								className="btn btn-normal"
								onClick={(e) => {
									prof.status === "ATIVO"
										? deactivate(prof.id!)
										: activate(prof.id!);
									e.currentTarget.disabled = true;
								}}
							>
								{prof.status === "ATIVO" ? "Desativar" : "Ativar"}
							</button>
							<Link
								className="btn btn-normal"
								to={`/professor/${prof.id}/edit`}
							>
								Editar
							</Link>
						</div>
					),
				},
			]);
		};

		return new DefaultTableModel(mapper(), [
			"Docente",
			"Matrícula",
			"Tipo de Contrato",
			"Status",
			"Ação",
		]);
	}

	// const professorsTable = new DefaultTableModel(setList(list), [
	// 	"Docente",
	// 	"Matrícula",
	// 	"Tipo de Contrato",
	// 	"Status",
	// 	"Ação",
	// ]);

	function searchItem(value: string) {
		setProfessorsTable(
			setList(list.filter((prof) => prof.name.includes(value) == true)),
		);

		console.log(professorsTable);
	}

	return (
		<div className="flex flex-col flex-1">
			<Header activeItem="Professores" />

			<main className="mx-5 flex flex-1 flex-col">
				<section className="flex flex-row justify-between items-center">
					<PageSection name={"Professores"} />
					<Link to="add" className="btn btn-success h-fit">
						+ Adicionar
					</Link>
				</section>
				<section className="flex flex-row my-4 justify-end">
					<FormInput
						type="search"
						name={"search"}
						onChange={(a: any) => {
							// console.log("ijasiodasjdo");
							searchItem(a.currentTarget.value);
						}}
					/>
				</section>
				<ComplexTableModelView data={professorsTable} />
			</main>
		</div>
	);
}
