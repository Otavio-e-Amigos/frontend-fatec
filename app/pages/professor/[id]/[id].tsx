import type { ReactNode } from "react";
import { Link } from "react-router";
import Header from "~/layouts/Header";
import ProfileBanner from "~/layouts/ProfileBanner";
import GenericFloor from "~/layouts/pages/GenericFloor";
import type Curso from "~/modules/curso/curso.class";
import type Disciplina from "~/modules/disciplina/disciplina.class";
import type PeriodoLetivo from "~/modules/periodo-letivo/periodo-letivo.class";
import type Professor from "~/modules/professor/professor.class";
import ProfessorGradesPanel from "../@layouts/ProfessorGradesPanel";

// Imagem do banner. Ex.: "/banners/professor.jpg" (arquivo em public/banners/).
// Enquanto for undefined, o banner mostra o degradê da marca.
const BANNER_IMAGE: string | undefined = undefined;

type AboutProps = {
	professor: Professor;
	periodos: PeriodoLetivo[];
	cursos: Curso[];
	disciplinas: Disciplina[];
};

function InfoItem({ label, children }: { label: string; children?: ReactNode }) {
	return (
		<div className="flex flex-col">
			<dt className="text-xs text-ink-muted">{label}</dt>
			<dd className="text-sm font-medium text-ink">{children || "—"}</dd>
		</div>
	);
}

export default function About({
	professor,
	periodos,
	cursos,
	disciplinas,
}: AboutProps) {
	return (
		<div className="flex flex-1 flex-col">
			<Header activeItem="Professores" />

			<ProfileBanner image={BANNER_IMAGE} alt={`Banner de ${professor.name}`} />

			{/* Dados principais */}
			<section className="floor-accent flex flex-wrap items-center justify-between gap-4 rounded-none border-x-0 px-5 py-4">
				<div className="flex items-center gap-4">
					<div className="flex flex-col gap-1">
						<h1 className="text-3xl leading-tight">
							{professor.name ?? "Professor"}
						</h1>
						<div className="flex flex-wrap items-center gap-1.5">
							<p className="text-xs text-ink-muted">Docente |</p>
							<span
								className="badge"
								data-tone={professor.status === "ATIVO" ? "ok" : undefined}
							>
								{professor.status}
							</span>
							<span className="chip">{professor.contract}</span>
						</div>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<Link className="link" to={`/professor/${professor.id}/edit`}>
						Editar
					</Link>
					<Link
						className="btn"
						data-variant="outline"
						to={`/professor/${professor.id}/grades/new`}
					>
						Criar grade horária
					</Link>
				</div>
			</section>

			<main className="mx-5 my-5 flex flex-1 flex-col gap-5">
				<div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
					<ProfessorGradesPanel
						professorId={Number(professor.id)}
						periodos={periodos}
						cursos={cursos}
						disciplinas={disciplinas}
					/>

					<GenericFloor
						className="p-4"
						header={
							<div className="px-4 py-3">
								<h2 className="text-xl font-bold text-red-950">
									Informações Gerais
								</h2>
							</div>
						}
					>
						<dl className="flex flex-col gap-3">
							<InfoItem label="Status">
								<span
									className="badge"
									data-tone={professor.status === "ATIVO" ? "ok" : undefined}
								>
									{professor.status}
								</span>
							</InfoItem>
							<InfoItem label="Tipo de contrato">{professor.contract}</InfoItem>
							<InfoItem label="Matrícula">{professor.registry}</InfoItem>
							<InfoItem label="Código do professor">{professor.code}</InfoItem>
							<InfoItem label="Titulação">{professor.title}</InfoItem>
						</dl>
					</GenericFloor>
				</div>
			</main>
		</div>
	);
}