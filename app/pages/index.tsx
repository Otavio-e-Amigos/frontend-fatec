import { Link } from "react-router";
import DefaultTableModel from "~/classes/TableModels/DefaultTableModel";
import ComplexTableModelView from "~/components/tables/ComplexTableView";
import Header from "~/layouts/Header";
import PageSection from "~/layouts/PageSection.layout";
import type Professor from "~/modules/professor/professor.class";
import NotificationBadge from "~/components/badges/NotificationBadge";

export default function Page({
	professorList,
}: {
	professorList: Professor[];
}) {
	const quickActionLinks: Array<{ label: string; href: string }> = [
		{ label: "Adicionar Professor", href: "/professor/add" },
		{ label: "Adicionar Disciplina", href: "/disciplina/add" },
		{ label: "Adicionar Curso", href: "/curso/add" },
		{ label: "Adicionar Periodo Letivo", href: "/periodo-letivo/add" },
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

	const notifications: any[] = [];

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

	// TODO remove mock and change with real data
	const professorMockTable = new DefaultTableModel(professorTableList, [
		"Docente",
		"Matrícula",
		"Status",
	]);

	return (

		<div className="flex flex-1 flex-col max-h-screen">
			<Header />
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
								<Link key={idx} to={action.href}>
									{action.label}
								</Link>
							))}
						</div>
					</section>
				</aside>
			</main>
		</div>
	);
}
