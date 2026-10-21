import { Link } from "react-router";
import DefaultTableModel from "~/classes/TableModels/DefaultTableModel";
import ComplexTableModelView from "~/components/tables/ComplexTableView";
import Header from "~/layouts/Header";
import PageSection from "~/layouts/PageSection.layout";
import type Professor from "~/modules/professor/professor.class";
import NotificationBadge from "~/components/badges/NotificationBadge";
import PageHeader from "~/layouts/PageHeader";
import GenericFloor from "~/layouts/pages/GenericFloor";

export default function Page({
	professorList,
}: {
	professorList: Professor[];
}) {
	const quickActionCards: Array<{
		topic: string;
		links: Array<{ label: string; href: string }>;
	}> = [
		{
			topic: "Professores",
			links: [{ label: "Adicionar Professor", href: "/professor/add" }],
		},
		{
			topic: "Disciplinas",
			links: [{ label: "Adicionar Disciplina", href: "/disciplina/add" }],
		},
		{
			topic: "Cursos",
			links: [{ label: "Adicionar Curso", href: "/curso/add" }],
		},
		{
			topic: "Períodos Letivos",
			links: [
				{ label: "Adicionar Período Letivo", href: "/periodo-letivo/add" },
			],
		},
	];

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

	// const professorMockTable = new DefaultTableModel(professorTableList as any, [
	// 	"Docente",
	// 	"Matrícula",
	// 	"Status",
	// ]);

	function Card({
		topic,
		links,
	}: {
		topic: string;
		links: Array<{ label: string; href: string }>;
	}) {
		function CardHeader() {
			return (
				<div className="flex flex-row mx-2 my-1">
					<p className="text-xl">{topic}</p>
				</div>
			);
		}

		return (
			<GenericFloor
				className="flex flex-col gap-1 px-3"
				header={<CardHeader />}
			>
				<div className="flex flex-col gap-1 my-1">
					{links.map(({ label, href }) => (
						<Link className="link" to={href}>
							{label}
						</Link>
					))}
				</div>
			</GenericFloor>
		);
	}

	return (
		<div className="flex flex-1 flex-col max-h-screen">
			<Header />
			<main className="grid grid-cols-4 flex-1 gap-x-8 m-5 overflow-hidden">
				<section className="col-span-4 flex flex-col gap-3">
					<PageHeader
						title={"Página Inicial"}
						description="Bem vindo de volta! O que gostaria de realizar por hoje?"
					/>
					{quickActionCards.map(({topic, links}) => <Card topic={topic} links={links}/>)}
					{/*<Card topic={""} links={[]} />*/}
					{/*<ComplexTableModelView data={professorMockTable} />*/}
				</section>
			</main>
		</div>
	);
}

// <aside className="grid grid-rows-2 gap-y-5 surface rounded-xl p-2 text-black overflow-hidden">
// 					{/* Resumo do dia */}
// 					{/*<section className="flex flex-col flex-1 overflow-hidden">
// 						<PageSection name="Resumo do dia" />

// 						<section className="flex flex-1 flex-col max-h-full gap-2 overflow-y-scroll">
// 							{notifications.map((notification, idx) => (
// 								<NotificationBadge key={idx} {...notification} />
// 							))}
// 						</section>
// 					</section>*/}

// 					{/* Ações Rápidas*/}
// 					<section>
// 						<PageSection name="Ações Rápidas" />

// 						<div className="flex flex-col gap-1">
// 							{quickActionLinks.map((action, idx) => (
// 								<Link key={idx} to={action.href}>
// 									{action.label}
// 								</Link>
// 							))}
// 						</div>
// 					</section>
// 				</aside>
