import DefaultTableModel from "~/classes/TableModels/DefaultTableModel";
import ComplexTableModelView from "~/components/tables/ComplexTableView";
import useWindow from "~/components/windows/useWindow";
import Header from "~/layouts/Header";
import PageHeader from "~/layouts/pages/PageHeader";
import type EventoCalendario from "~/modules/calendario/calendario.class";
import SaveEventoForm from "./@layouts/SaveEventoForm";
import mapper from "./@mappers/calendario-table.mapper";
import { Plus } from "iconoir-react";

export default function CalendarioIndex({ list }: { list: EventoCalendario[] }) {
	const window = useWindow({
		wrapper: <SaveEventoForm />,
		initialData: { dismissible: true },
	});

	const table = new DefaultTableModel(list.map(mapper), [
		"Data",
		"Dia",
		"Descrição",
		"Tipo",
		"Sem aula",
		"",
	]);

	return (
		<div className="flex flex-col flex-1">
			<Header activeItem="Calendário" />
			<main className="mx-5 my-4 flex flex-1 flex-col">
				<section className="flex flex-row justify-between items-center">
					<PageHeader
						title={"Calendário Acadêmico"}
						subTitle={"Recursos Acadêmicos"}
						description={
							"Cadastre feriados, emendas e dias sem aula. Eles são usados na geração da folha de ponto."
						}
						headerItems={
							<button
								type="button"
								className="btn w-fit"
								data-variant="outline"
								data-size="sm"
								onClick={() => window.show()}
							>
								<Plus />
								<p>Novo Evento</p>
							</button>
						}
					/>
				</section>

				<section className="my-2 text-sm text-slate-600">
					<p>
						Os feriados fixos nacionais (como 21/04, 07/09 e 25/12) já são considerados
						automaticamente e não aparecem nesta lista. Para reabrir um deles como dia
						letivo, cadastre um evento na data com "Suspende as aulas?" = Não.
					</p>
				</section>

				<section className="my-4">
					<ComplexTableModelView data={table} />
				</section>
			</main>
		</div>
	);
}
