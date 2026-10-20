import { useState } from "react";
import { Form, Link, useNavigate } from "react-router";
import DefaultTableModel from "~/classes/TableModels/DefaultTableModel";
import ConfirmationDialog from "~/components/ConfirmationDialog";
import FormInput from "~/components/forms/FormInput";
import ComplexTableModelView from "~/components/tables/ComplexTableView";
import Header from "~/layouts/Header";
import PageHeader from "~/layouts/PageHeader";
import PageSection from "~/layouts/PageSection.layout";
import Professor from "~/modules/professor/professor.class";
import ProfessorService from "~/modules/professor/professor.service";
import AuthService from "~/modules/user/auth.service";

export default function Page({ list }: { list: Professor[] }) {
	// TODO test and switch with ObjectTableModel
	//
	//
	const navigate = useNavigate();
	const auth = AuthService.getUserToken();
	// const [professorsTableList, setProfessorsTableList] = useState(setList(list));

	const [professorsTable, setProfessorsTable] = useState(setList(list));
	const [professorToDeactivate, setProfessorToDeactivate] =
		useState<Professor | null>(null);
	const [deactivationError, setDeactivationError] = useState<string>();

	async function activate(id: number) {
		const res = await ProfessorService.activate(id, auth);
		if (res) {
			navigate(0);
		}
	}

	async function deactivate(id: number) {
		try {
			const res = await ProfessorService.deactivate(id, auth);
			if (res) {
				setProfessorToDeactivate(null);
				navigate(0);
			} else {
				setDeactivationError("Não foi possível desativar o professor. Tente novamente.");
			}
		} catch (error) {
			setDeactivationError(
				error instanceof Error
					? error.message
					: "Ocorreu um erro ao desativar o professor.",
			);
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
						<div key={prof.id} className="row-actions">
							<Link
								className="btn"
								data-variant="icon"
								data-icon="edit"
								title="Editar"
								to={`/professor/${prof.id}/edit`}
							>
								Editar
							</Link>
							<button
								type="button"
								className="btn"
								data-variant="icon"
								data-icon="power"
								title={prof.status === "ATIVO" ? "Desativar" : "Ativar"}
								onClick={() => {
									if (prof.status === "ATIVO") {
										setDeactivationError(undefined);
										setProfessorToDeactivate(prof);
									} else {
										void activate(prof.id!);
									}
								}}
							>
								{prof.status === "ATIVO" ? "Desativar" : "Ativar"}
							</button>
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
			"",
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
		const term = value.toLowerCase().trim();
		if (!term) {
			setProfessorsTable(setList(list));
			return;
		}
		const filtered = list.filter((prof) => {
			const nameMatch = prof.name ? prof.name.toLowerCase().includes(term) : false;
			const registryMatch = prof.registry ? prof.registry.toLowerCase().includes(term) : false;
			return nameMatch || registryMatch;
		});
		setProfessorsTable(setList(filtered));
	}

	return (
		<div className="flex flex-col flex-1">
			<Header activeItem="Professores" />

			<main className="mx-5 flex flex-1 flex-col my-4 gap-3">
				<section className="flex flex-row justify-between items-center">
					{/* <PageSection name={"Professores"} /> */}
					<PageHeader
						title={"Professores"}
						subTitle={"Gestão de Docentes"}
						description={"Explore e visualize as opções disponíveis para cada docente"}
						headerItems={(
							<Link className="btn w-fit" data-variant="outline" data-size="sm" to="add">
								+ Adicionar
							</Link>
						)}
					/>
				</section>
				<section className="flex flex-row my-4 justify-end items-center gap-5">
					<FormInput
						type="search"
						name={"search"}
						placeholder="Pesquisar..."
						onChange={(a: any) => {
							// if this doesnt work, FormInput may have it's variable onChange commented for some reason
							searchItem(a.currentTarget.value);
						}}

					/>
					{/* <Link className="btn" data-variant="outline" data-size="sm" to="add">
						+ Adicionar
					</Link> */}

				</section>
				<ComplexTableModelView data={professorsTable} />
			</main>
			{professorToDeactivate && (
				<ConfirmationDialog
					title="Desativar professor?"
					description={`O professor ${professorToDeactivate.name ?? ""} não ficará disponível enquanto estiver desativado.`}
					confirmLabel="Desativar"
					errorMessage={deactivationError}
					onConfirm={() => deactivate(professorToDeactivate.id!)}
					onCancel={() => setProfessorToDeactivate(null)}
				/>
			)}
		</div>
	);
}
