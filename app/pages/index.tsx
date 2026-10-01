import { Link } from "react-router";
import DefaultTableModel from "~/classes/TableModel/DefaultTableModel";
import ComplexTableModelView from "~/components/tables/ComplexTableView";
import Header from "~/layouts/Header";
import PageSection from "~/layouts/PageSection.layout";
import type Professor from "~/modules/professor/professor.class";

function NotificationBadge({
	state,
	description,
	action,
}: {
	state: string;
	description: string;
	action: any;
}) {
	return (
		<div className="p-2 flex flex-1 flex-row items-start gap-2 rounded-xl border-2 border-x-slate-500 border-y-slate-400 bg-slate-100">
			<img src="/favicon.ico" className="size-6" />
			<div className="flex flex-col gap-1">
				<div className="flex-1">{description}</div>
				{action}
			</div>
		</div>
	);
}

export default function Page({
	professorList,
}: {
	professorList: Professor[];
}) {
	const quickActionLinks: Array<{ label: string; href: string }> = [
		{ label: "Adicionar Professor", href: "/professor/add" },
		// { label: "Grade", href: "/" },
		// { label: "Folha de Ponto", href: "/" },
	];

	// const notifications = [
	// 	{
	// 		state: "info",
	// 		description:
	// 			"Notificações importantes do sistema ficam aqui, clique abaixo para saber mais.",
	// 		action: (
	// 			<Link to={"/"} className="link">
	// 				Saiba mais
	// 			</Link>
	// 		),
	// 	},
	// 	{
	// 		state: "alert",
	// 		description:
	// 			"Faltam 7 dias para renovar as grades dos professores para as folhas de ponto. Aproveite o tempo para renová-las e previnir futuros imprevistos.",
	// 		action: (
	// 			<Link to={"/"} className="link">
	// 				Vamos lá! -&gt;
	// 			</Link>
	// 		),
	// 	},
	// 	{
	// 		state: "info",
	// 		description:
	// 			"O professor [INSIRA NOME] não está completamente configurado para possuir sua folha de ponto gerada automaticamente",
	// 		action: (
	// 			<Link to={"/"} className="link">
	// 				Vamos lá! -&gt;
	// 			</Link>
	// 		),
	// 	},
	// ];

	const notifications = []

	// function ProfessorLink(name: any):React.ReactElement {
	// 	return <span className="text-indigo-500">{ name }</span>
	// }
	//

	const professorTableList = professorList.map((prof) => [
		{
			value: prof.name,
			display: (
				<Link key={prof.id} className="link" to={`/professor/${prof.id}`}>
					{prof.name}
				</Link>
			),
		},
		prof.registry,
		prof.status,
	]);

	const professorMockTable = new DefaultTableModel(
		// [
		// 	[
		// 		{
		// 			value: professors[0].name,
		// 			display: (
		// 				<Link className="link" to={"/professor/1"}>
		// 					{professors[0].name}
		// 				</Link>
		// 			),
		// 		},
		// 		professors[0].cpf,
		// 		professors[0].registry,
		// 	],
		// 	[
		// 		{
		// 			value: professors[1].name,
		// 			display: (
		// 				<Link className="link" to={"/professor/2"}>
		// 					{professors[1].name}
		// 				</Link>
		// 			),
		// 		},
		// 		professors[1].cpf,
		// 		professors[1].registry,
		// 	],
		// ],
		professorTableList,
		["Docente", "CPF", "Status"],
	);

	// console.log(React.isValidElement(<ProfessorLink name="sodkoskd"/>))
	// const Test = <ProfessorLink name="Tester"/>

	// console.log(Test)

	return (
		// <main className="bg-cps min-h-full">
		<div className="flex flex-1 flex-col max-h-screen">
			<Header />
			{/*{Test()}*/}
			<main className="grid grid-cols-4 flex-1 gap-x-8 m-5 overflow-hidden">
				<section className="col-span-3 flex flex-col">
					{/*<PageSection name="Grades Recentes" />*/}
					<PageSection name="Professores Recentes" />

					<ComplexTableModelView data={professorMockTable} />
				</section>

				<aside className="grid grid-rows-2 gap-y-5 surface rounded-xl p-2 text-black overflow-hidden">
					{/* Resumo do dia */}
					<section className="flex flex-col flex-1 overflow-hidden">
						<PageSection name="Resumo do dia" />

						<section className="flex flex-1 flex-col max-h-full gap-2 overflow-y-scroll">
							{notifications.map((notification, idx) => (
								<NotificationBadge key={idx} {...notification} />
							))}
						</section>
					</section>

					{/* Ações Rápidas*/}
					<section>
						<PageSection name="Ações Rápidas" />

						<div className="flex flex-col gap-1">
							{quickActionLinks.map((action, idx) => (
								<Link key={idx} to={action.href}>{action.label}</Link>
							))}
						</div>
					</section>
				</aside>
			</main>
		</div>
	);
}
