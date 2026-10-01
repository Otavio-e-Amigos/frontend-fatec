import type { ReactNode } from "react";
import { Link } from "react-router";
import Header from "~/layouts/Header";
import PageSection from "~/layouts/PageSection.layout";
import type Professor from "~/modules/professor/professor.class";

function ProfessorInfo({ professor }: { professor?: Professor }) {
	function InfoBadge({
		icon,
		info,
	}: {
		icon: string;
		info: string | ReactNode;
	}) {
		return (
			<div className="flex flex-row items-center gap-2">
				<img src={icon} />
				{info}
			</div>
		);
	}

	return (
		<div className="flex flex-row justify-between">
			<summary className="flex flex-col">
				<p className="text-3xl">{professor?.name ?? "Professor"}</p>
				<p className="text-slate-300 text-xs">
					Docente | {professor?.status} | {professor?.contract}
				</p>
				{/*<section className="flex flex-row gap-4">
					<InfoBadge icon={"/"} info={<Link to={"mailto:PROFESSOR.EMAIL@EMAIL.DOMAIN"}>PROFESSOR.EMAIL@EMAIL.DOMAIN</Link>} />
					<InfoBadge icon={"/"} info={"(11) 12345-6789"} />
					<InfoBadge icon={"/"} info={"@TEAMSUSER"} />
				</section>*/}
			</summary>

			<section className="flex flex-col gap-2">
				<div className="flex flex-col">
					<Link className="link" to={`/professor/${professor?.id}/edit`}>Editar</Link>

					{/* TODO insert confirmation window here */}
					{/*<Link to={"/"}>Excluir</Link>*/}
				</div>

				{/*<div className="flex flex-col">
					<Link to={"/"}>Visualizar Grade</Link>
					<Link to={"/"}>Gerar Folha de Ponto</Link>
				</div>*/}
			</section>
		</div>
	);
}

export default function About({ professor }: { professor: Professor }) {
	console.log(professor);
	return (
		<>
			<main className="flex flex-1 flex-col">
				{/* cool background */}
				<div className="flex flex-col bg-indigo-200 min-h-60">
					<Header activeItem="Professores" />
				</div>

				{/*about page*/}
				<section className="flex flex-col px-10 py-3 bg-item-button">
					<ProfessorInfo professor={professor} />
				</section>

				<section className="flex flex-col px-10 py-3 pt-6 gap-5">
					<div className="flex flex-row gap-3">
						<button className="btn btn-normal">Geral</button>
						{/*<button className="btn btn-inactive">Grades</button>*/}
						{/*<button className="btn btn-inactive">Folhas de Ponto</button>*/}
					</div>
					<section className="surface rounded-lg px-3 py-1 text-black flex flex-col">
						<PageSection name={"Informações Gerais"} />
						<ul className="list-disc ml-5">
							<li>
								<b>Status</b>: {professor.status}
							</li>
							<li>
								<b>Tipo de Contrato</b>: {professor.contract}
							</li>
							<li>
								<b>Matrícula</b>: {professor.registry}
							</li>
							<li>
								<b>Código do Professor</b>: {professor.code}
							</li>
							{/*<li>
								<b>CPF</b>: {professor.cpf}
							</li>*/}
						</ul>
						{/*<p>Nome: {professor.name}</p>*/}
						{/*<p></p>*/}
						{/*<p>CPF: {professor.cpf}</p>*/}
						{/*<p>CURSOS MINISTRADOS</p>*/}
						{/*<p>STATUS GRADE ATUAL</p>*/}
						{/*<p></p>*/}
						{/*<p></p>*/}
						{/*<p></p>*/}
					</section>
				</section>
			</main>
		</>
	);
}
