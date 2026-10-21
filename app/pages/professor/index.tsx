import { useMemo, useState } from "react";
import { Link, useRevalidator } from "react-router";
import getErrorMessage from "~/classes/errors/get-error-message";
import DefaultTableModel from "~/classes/TableModels/DefaultTableModel";
import FormInput from "~/components/forms/FormInput";
import ComplexTableModelView from "~/components/tables/ComplexTableView";
import useDialogs from "~/hooks/useDialogs";
import Header from "~/layouts/Header";
import PageHeader from "~/layouts/PageHeader";
import type Professor from "~/modules/professor/professor.class";
import ProfessorService from "~/modules/professor/professor.service";
import AuthService from "~/modules/user/auth.service";

export default function Page({ list }: { list: Professor[] }) {
	const auth = AuthService.getUserToken();
	const dialogs = useDialogs();
	const { revalidate } = useRevalidator();
	const [term, setTerm] = useState("");

	async function activate(prof: Professor) {
		try {
			const res = await ProfessorService.activate(prof.id!, auth);
			if (!res) throw new Error();
			dialogs.toast.success(`${prof.name} foi ativado.`);
			revalidate();
		} catch (error) {
			dialogs.toast.error(
				getErrorMessage(error, "Não foi possível ativar o professor."),
			);
		}
	}

	async function deactivate(prof: Professor) {
		const done = await dialogs.confirm({
			title: "Desativar professor?",
			description: `O professor ${prof.name ?? ""} não ficará disponível enquanto estiver desativado.`,
			confirmLabel: "Desativar",
			tone: "danger",
			onConfirm: async () => {
				const res = await ProfessorService.deactivate(prof.id!, auth);
				if (!res) {
					throw new Error(
						"Não foi possível desativar o professor. Tente novamente.",
					);
				}
			},
		});
		if (done) {
			dialogs.toast.success(`${prof.name} foi desativado.`);
			revalidate();
		}
	}

	const filtered = useMemo(() => {
		if (!term) return list;
		return list.filter((prof) =>
			[prof.name, prof.registry].some((value) =>
				value ? value.toLowerCase().includes(term) : false,
			),
		);
	}, [list, term]);

	const professorsTable = useMemo(() => {
		const rows = filtered.map((prof) => [
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
							onClick={() =>
								prof.status === "ATIVO"
									? void deactivate(prof)
									: void activate(prof)
							}
						>
							{prof.status === "ATIVO" ? "Desativar" : "Ativar"}
						</button>
					</div>
				),
			},
		]);

		return new DefaultTableModel(rows as any, [
			"Docente",
			"Matrícula",
			"Tipo de Contrato",
			"Status",
			"",
		]);
	}, [filtered]);

	return (
		<div className="flex flex-col flex-1">
			<Header activeItem="Professores" />

			<main className="mx-5 my-4 flex flex-1 flex-col gap-3">
				<section className="flex flex-row justify-between items-center">
					<PageHeader
						title={"Professores"}
						subTitle={"Recursos Acadêmicos"}
						description={
							"Explore e visualize as opções disponíveis para cada docente"
						}
						headerItems={
							<Link
								className="btn w-fit"
								data-variant="outline"
								data-size="sm"
								to="add"
							>
								+ Novo Professor
							</Link>
						}
					/>
				</section>

				<section className="flex flex-row my-4 justify-end items-center gap-5">
					<FormInput
						type="search"
						name={"search"}
						placeholder="Pesquisar..."
						onChange={(event: any) =>
							setTerm(event.currentTarget.value.toLowerCase().trim())
						}
					/>
				</section>

				<ComplexTableModelView data={professorsTable} />
			</main>
		</div>
	);
}