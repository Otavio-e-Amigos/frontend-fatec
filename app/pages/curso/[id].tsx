import type { ReactNode } from "react";
import { Link } from "react-router";
import Header from "~/layouts/Header";
import PageSection from "~/layouts/PageSection.layout";
import type Curso from "~/modules/curso/curso.class";


function CursoInfo({ curso }: { curso?: Curso }) {
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
				<p className="text-3xl">{curso?.name ?? "Professor"}</p>
				<p className="text-slate-300 text-xs">
					Curso | {curso?.shift} | {curso?.unit}
				</p>
				{/*<section className="flex flex-row gap-4">
					<InfoBadge icon={"/"} info={<Link to={"mailto:PROFESSOR.EMAIL@EMAIL.DOMAIN"}>PROFESSOR.EMAIL@EMAIL.DOMAIN</Link>} />
					<InfoBadge icon={"/"} info={"(11) 12345-6789"} />
					<InfoBadge icon={"/"} info={"@TEAMSUSER"} />
				</section>*/}
			</summary>

			<section className="flex flex-col gap-2">
				<div className="flex flex-col">
					<Link className="link" to={`/curso/${curso?.id}/edit`}>Editar</Link>

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

export default function About({ curso }: { curso: Curso }) {
	console.log(curso);
	return (
		<>
			<main className="flex flex-1 flex-col">
				{/* cool background */}
				<div className="flex flex-col bg-indigo-200 min-h-60">
					<Header activeItem="Curso" />
				</div>

				{/*about page*/}
				<section className="flex flex-col px-10 py-3 bg-item-button">
					<CursoInfo curso={curso} />
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
								<b>Turno</b>: {curso.shift}
							</li>
							<li>
								<b>Unidade</b>: {curso.unit}
							</li>
							<li>
								<b>Sigla</b>: {curso.acronym}
							</li>
							<li>
								<b>Nome do curso</b>: {curso.name}
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
