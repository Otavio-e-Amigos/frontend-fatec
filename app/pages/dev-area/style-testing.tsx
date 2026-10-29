import { Form, Link } from "react-router";
import DefaultTableModel from "~/classes/TableModels/DefaultTableModel";
import ComplexTableModelView from "~/components/tables/ComplexTableView";
import SimpleTableModelView from "~/components/tables/SimpleTableView";
import Header from "~/layouts/Header";
import PageSection from "~/layouts/pages/PageSection";
import StatusBadge from "~/components/badges/StatusBadge";
import FormInput from "~/components/forms/FormInput";
import SaveProfessorForm from "../professor/@layouts/SaveProfessorForm";
import GenericFloor from "~/layouts/pages/GenericFloor";
import GenericSurface from "~/layouts/pages/GenericSurface";
// import EditPage from "../professor/edit";
// import Professor from "~/modules/professor/professor.class";

const defaultTableTest = new DefaultTableModel(
	[
		[
			{
				value: "data01",
				display: (
					<Link className="text-rose-500" to={"/"}>
						data01
					</Link>
				),
			},
			0,
			"data03",
		],
		[
			"data04",
			{ value: 2, display: <p className="text-amber-500 cursor">2</p> },
			"data06",
		],
		["data07", 4, "data09"],
		[
			"data10",
			6,
			{
				value: "data12",
				display: (
					<span className="flex flex-row gap-2 items-center">
						<img src="/favicon.ico" /> <p>data12</p>
					</span>
				),
			},
		],
		[
			"data00",
			1,
			{
				value: "data13",
				display: (
					<span className="flex flex-row gap-2 items-center">
						<img src="/favicon.ico" /> <p>data13</p>
					</span>
				),
			},
		],
	],
	["column01", "column02", "column03"],
);

function PageSubSection({ name }: { name: string }) {
	return <h1>{name}</h1>;
}

function ComponentSectionTest() {
	return (
		<>
			<p className="mb-3">General System Components</p>
			<div className="flex flex-col gap-2 w-fit">
				<div className="flex flex-row gap-2">
					<button className="btn">Botão</button>
					<button className="btn" data-variant="outline">
						Outline
					</button>
					<button className="btn" data-icon="edit">
						Editar
					</button>
					<button className="btn" data-variant="icon" data-icon="edit" />
					<button className="btn" data-variant="danger">
						Cancelar
					</button>
				</div>
				<div className="flex flex-row gap-2">
					<div className="badge" data-tone="ok">
						OK
					</div>
					<div className="badge" data-tone="warn">
						WARNING
					</div>
					<div className="badge" data-tone="danger">
						DANGER
					</div>
				</div>
				<div className="flex flex-row gap-2">
					<div className="chip w-fit">Chip #01</div>
					<div className="chip w-fit">Chip #02</div>
					<div className="chip w-fit">Chip #03</div>
				</div>
				<div className="flex flex-row gap-2">
					<div>
						<div className="card p-2" data-interactive>
							<div className="card-header">
								<p className="card-title">Title</p>
								<p className="card-subtitle">subtitle</p>
								<p className="card-link">link</p>
								<div className="card-body">
									<p>body</p>
									<p>body</p>
									<p>body</p>
								</div>
								<div className="card-footer">
									<p>body</p>
									<p>body</p>
									<p>body</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<Link to={"/"} className="link">
					Hyperlink
				</Link>
			</div>
		</>
	);
}

function HeaderComponent() {
	return <p>Hello!</p>;
}

export default function Page() {
	return (
		<main>
			<Header activeItem="dev-area" />
			<PageSection name={"Style laboratory"} />
			<section className="mt-5 flex flex-col mx-5">
				<PageSection name={"Generic Floors"} />
				<GenericFloor header={<HeaderComponent />}>asodk</GenericFloor>

				<GenericSurface header={<HeaderComponent />}>askoaskd</GenericSurface>
				<PageSection name={"Page Layouts"} />
				<div className="flex flex-col w-full gap-5 p-2 rounded-lg">
					<div className="bg-page-floor min-h-100 flex flex-col border border-page-floor-outline/25 rounded-lg">
						<div className="p-4 py-3 bg-page-floor-accent rounded-lg rounded-b-none min-h-20 border border-x-0 border-t-0 border-page-floor-outline/25">
							<p className="text-2xl text-rose-900">Seção sobre algo</p>
						</div>
						{/*<SaveProfessorForm />*/}
						<div className="m-5 flex flex-col gap-3">
							<div className="bg-page-surface border border-slate-800/25 rounded-lg">
								<div className="p-4 py-3 bg-page-surface-accent rounded-lg rounded-b-none min-h-10 border border-x-0 border-t-0 border-page-surface-outline/25">
									<p className="text-2xl text-slate-900">
										Sub-Seção sobre algo
									</p>
								</div>
								<div className="m-5">
									Informações legais que são contidas dentro de uma superfície.
								</div>
							</div>
							<div className="flex flex-1 flex-row items-center gap-5 bg-page-surface border border-page-surface-outline/25 rounded-lg">
								<div className="p-5 py-3 bg-page-surface-accent rounded-lg rounded-e-none min-h-10 border-r  border-page-surface-outline/25">
									Uma Seção com formato diferente
								</div>
								<p className="flex-1">AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA</p>
							</div>

							<div className="bg-page-surface border border-slate-800/25 rounded-lg">
								<div className="p-4 py-3 bg-page-surface-accent rounded-lg rounded-b-none min-h-10 border border-x-0 border-t-0 border-page-surface-outline/25">
									<p className="text-2xl text-slate-900">
										Sub-Seção sobre algo
									</p>
								</div>
								<div className="m-5">
									<ComponentSectionTest />
								</div>
							</div>

							<div>
								<ComponentSectionTest />
							</div>

							<ComplexTableModelView data={defaultTableTest} />
						</div>
					</div>
				</div>

				<PageSection name={"Components"} />
				<PageSubSection name={"Buttons"} />
				<PageSubSection name={"Badges and related"} />
				<PageSubSection name={"Tables"} />
				{/*<PageSubSection name={"Dialogs"}/>*/}
				{/*<PageSubSection name={"Buttons"}/>*/}
				<PageSection name={"Text"} />
				{/*<PageSection name={"Forms"}/>*/}
			</section>
		</main>
	);
}
