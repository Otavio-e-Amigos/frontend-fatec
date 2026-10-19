import type { ReactNode } from "react";
import { Link } from "react-router";
// import CPFFormatter from "~/classes/ValueFormatters/CPFFormatter";
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
				<div className="flex flex-row items-center gap-1.5">
					<p className="text-gray-400 text-xs">Docente |</p>
					<p className="badge" data-tone={professor?.status === "ATIVO" ? "ok" : undefined}>{professor?.status}</p>
					<p className="chip">{professor?.contract}</p>
				</div>
				{/*<p className="text-gray-400 text-xs">
					Docente | {professor?.status} | {professor?.contract}
				</p>*/}
				<section className="flex flex-row gap-4">
					{/*<InfoBadge icon={"/"} info={<Link to={"mailto:PROFESSOR.EMAIL@EMAIL.DOMAIN"}>PROFESSOR.EMAIL@EMAIL.DOMAIN</Link>} />*/}
					{/*<InfoBadge icon={"/"} info={"(11) 12345-6789"} />*/}
					{/*<InfoBadge icon={"/"} info={"@TEAMSUSER"} />*/}
					{/*<InfoBadge icon={"/"} info={CPFFormatter.format(professor?.cpf as string)} />*/}
				</section>
			</summary>

			<section className="flex flex-col gap-2">
				<div className="flex flex-col">
					<Link className="link" to={`/professor/${professor?.id}/edit`}>Editar</Link>
					<Link
						className="btn mt-2"
						data-variant="outline"
						to={`/professor/${professor?.id}/grades/new`}
					>
						Criar grade horária
					</Link>

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
				<div className="flex flex-col bg-page-floor min-h-60">
					<Header activeItem="Professores" />
				</div>

				{/*about page*/}
				<section className="floor-accent border-x-0 rounded-none flex flex-col px-10 py-3">
					<ProfessorInfo professor={professor} />
				</section>

				<section className="flex flex-col px-10 py-3 pt-6 gap-5">
					<div className="flex flex-row gap-3">
						<button className="btn">Geral</button>
						{/*<button className="btn btn-inactive">Grades</button>*/}
						{/*<button className="btn btn-inactive">Folhas de Ponto</button>*/}
					</div>
					<section className="floor rounded-lg text-black flex flex-col">
						<div className="floor-accent p-2 border-x-0 border-t-0 rounded-b-none">
							<h1 className="text-3xl font-medium">Informações Gerais</h1>
						</div>
						{/*<PageSection name={"Informações Gerais"} />*/}
						<main className="px-3 py-4">
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
							</ul>
						</main>
					</section>
				</section>
			</main>
		</>
	);
}
