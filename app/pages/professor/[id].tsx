import type { ReactNode } from "react";
import { Link } from "react-router";
import Header from "~/layouts/Header";
import type Professor from "~/modules/professor/professor.class";

function ProfessorInfo({professor}: {professor?:Professor}) {

	function InfoBadge({icon, info}: {icon:string, info:string | ReactNode}) {
		return (
			<div className="flex flex-row items-center gap-2">
				<img src={icon} />
				{info}
			</div>
		)
	}

	return (
		<div className="flex flex-row justify-between">
			<summary className="flex flex-col">
				<p className="text-3xl">PROFESSOR</p>
				<p className="text-slate-300 text-xs">COURSES</p>
				<section className="flex flex-row gap-4">
					<InfoBadge icon={"/"} info={<Link to={"mailto:PROFESSOR.EMAIL@EMAIL.DOMAIN"}>PROFESSOR.EMAIL@EMAIL.DOMAIN</Link>} />
					<InfoBadge icon={"/"} info={"(11) 12345-6789"} />
					<InfoBadge icon={"/"} info={"@TEAMSUSER"} />
				</section>
			</summary>

			<section className="flex flex-col gap-2">
				<div className="flex flex-col">
					<Link to={"/"}>Editar</Link>
					<Link to={"/"}>Excluir</Link>
				</div>

				<div className="flex flex-col">
					<Link to={"/"}>Visualizar Grade</Link>
					<Link to={"/"}>Gerar Folha de Ponto</Link>
				</div>
			</section>
		</div>
	)
}


export default function About() {
	return (
		<>
			<main className="flex flex-1 flex-col">

				{/* cool background */}
				<div className="flex flex-col bg-indigo-300 min-h-60">
					<Header activeItem="Professores"/>
				</div>

				{/*about page*/}
				<section className="flex flex-col px-10 py-3 bg-indigo-400">
					<ProfessorInfo professor={undefined} />
				</section>

				<section className="px-10 py-3">
					CONTAINER HERE
				</section>
			</main>
		</>
	)
}
