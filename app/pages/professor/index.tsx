import { Link } from "react-router";
import DefaultTableModel from "~/classes/TableModel/DefaultTableModel";
import FormInput from "~/components/forms/FormInput";
import ComplexTableModelView from "~/components/tables/ComplexTableView";
import Header from "~/layouts/Header";
import PageSection from "~/layouts/PageSection.layout";

export default function Page() {
	// TODO test and switch with ObjectTableModel
	const professorsTable = new DefaultTableModel(
		[

		],
		[
			'Docente',
			'Matrícula',
			'CPF',
			'Curso(s)',
		]
	)

	function searchItem(value: string) {
		console.log(value)
	}

	return (
		<div className="flex flex-col flex-1">
			<Header activeItem="Professores" />

			<main className="mx-5 flex flex-1 flex-col">
				<section className="flex flex-row justify-between items-center">
					<PageSection name={"Professores"} />
					<Link to="add" className="btn btn-success h-fit">+ Adicionar</Link>
				</section>
				<section className="flex flex-row my-4 justify-end">
					<FormInput type="search" name={"search"} onChange={a => {searchItem(a.currentTarget.value)}}/>
				</section>
				<ComplexTableModelView data={professorsTable}/>
			</main>
		</div>
	)
}
