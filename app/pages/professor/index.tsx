import { useMemo, useState } from "react";
import { Link, useRevalidator } from "react-router";
import getErrorMessage from "~/classes/errors/get-error-message";
import DefaultTableModel from "~/classes/TableModels/DefaultTableModel";
import FormInput from "~/components/forms/FormInput";
import ComplexTableModelView from "~/components/tables/ComplexTableView";
import useDialogs from "~/hooks/useDialogs";
import Header from "~/layouts/Header";
import PageHeader from "~/layouts/pages/PageHeader";
import type Professor from "~/modules/professor/professor.class";
import ProfessorService from "~/modules/professor/professor.service";
import AuthService from "~/modules/user/auth.service";
import mapper from "./@mappers/professor-table.mapper";
import filter from "./@filters/professor-table.filter";
import useWindow from "~/hooks/useWindow";
import BasicWindow from "~/layouts/windows/BasicWindow";
import deactivateWindow from "./@windows/deactivate.window";
// import activate from "./@actions/activate.action";

export default function Page({ list }: { list: Professor[] }) {
	const auth = AuthService.getUserToken();
	const dialogs = useDialogs();
	const { revalidate } = useRevalidator();
	const [term, setTerm] = useState("");
	// const window = useWindow({
		// ...deactivateWindow,
		// extras: {
		// 	actions: {
		// 		activate,
		// 		deactivate
		// 	}
		// }
	// });
	const window = useWindow(deactivateWindow)

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
		const test = window.show()
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
		return list.filter((prof) => filter(prof, term));
	}, [list, term]);

	const professorsTable = useMemo(() => {
		const rows = filtered.map((prof) => mapper(prof, deactivate, activate));

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
				{/*<section className="flex flex-row justify-between items-center">
				</section>*/}

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
