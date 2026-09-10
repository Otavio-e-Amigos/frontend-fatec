import { Form, Link } from "react-router";
import DefaultTableModel from "~/classes/TableModel/DefaultTableModel";
import ComplexTableModelView from "~/components/tables/ComplexTableView";
import SimpleTableModelView from "~/components/tables/SimpleTableView";
import Divider from "~/layouts/Divider.layout";
import Header from "~/layouts/Header";
import PageSection from "~/layouts/PageSection.layout";

export default function Page() {

	const quickActionLinks: Array<{label: string, href: string}> = [
		{label: 'Adicionar Professor', href: "/"},
		{label: 'Adicionar Professor', href: "/"},
		{label: 'Adicionar Professor', href: "/"},
		{label: 'Adicionar Professor', href: "/"}
	]

  return (
  // <main className="bg-cps min-h-full">
    <div className="flex flex-1 flex-col">
			<Header />

			<main className="grid grid-cols-4 flex-1 gap-x-8 m-5">

				<section className="col-span-3 flex flex-col">
					<div>
						<PageSection name="Grades Recentes" />
						Tabela com 5-10 dados recentes aqui
					</div>
				</section>

				<aside className="grid grid-rows-2 gap-y-5 surface p-2 text-black">

					{/* Resumo do dia */}
					<section>
						<PageSection name="Resumo do dia" />
						<section className="flex flex-col gap-2">
							<span>notificação 01</span>
							<span>notificação 02</span>
							<span>notificação 03</span>
							<span>notificação 04</span>
						</section>

					</section>

					{/* Ações Rápidas*/}
					<section>
						<PageSection name="Ações Rápidas" />

						<div className="flex flex-col gap-1">
							{quickActionLinks.map(action => <span>{ action.label }</span>)}
						</div>
					</section>
				</aside>
			</main>

    </div>
  )
}
