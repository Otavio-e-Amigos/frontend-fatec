import {
	courseKey,
	disciplineKey,
	findCourse,
	findDiscipline,
	findPeriod,
	findProfessor,
} from "~/modules/grade/extraction/grade-extraction.registry";
import { PERIOD_OPTIONS } from "~/modules/grade/extraction/grade-extraction.types";
import type { GradeImportState } from "../@hooks/useGradeImport";
import { Pill } from "./GradeImportFields";

type Row = { label: string; detail: string; registered: boolean };

/** Shows what already exists in the system and what will be created, then saves the grade. */
export default function GradeImportRegistry({ state }: { state: GradeImportState }) {
	const { data, registry, error, isSaving, errors } = state;
	if (!data) return null;

	const shiftLabel = (value: string) =>
		PERIOD_OPTIONS.find((option) => option.value === value)?.label ?? value;

	const rows: Row[] = [
		{
			label: "Docente",
			detail: `${data.professor.nome || "—"} (mat. ${data.professor.matricula || "—"})`,
			registered: !!findProfessor(registry, data.professor),
		},
		{
			label: "Período letivo",
			detail: `${data.semestre ?? "—"}º semestre de ${data.ano ?? "—"}`,
			registered: !!findPeriod(registry, data),
		},
	];

	const courses = new Map<string, Row>();
	const disciplines = new Map<string, Row>();
	for (const item of data.disciplinas) {
		if (item.curso.trim() && item.periodo) {
			courses.set(courseKey(item.curso, item.periodo), {
				label: "Curso",
				detail: `${item.curso} (${shiftLabel(item.periodo)})`,
				registered: !!findCourse(registry, item.curso, item.periodo),
			});
		}
		if (item.nome.trim()) {
			disciplines.set(disciplineKey(item.nome), {
				label: "Disciplina",
				detail: item.nome,
				registered: !!findDiscipline(registry, item.nome),
			});
		}
	}
	rows.push(...courses.values(), ...disciplines.values());

	const toCreate = rows.filter((row) => !row.registered).length;

	return (
		<section className="surface flex flex-col gap-4 rounded-card p-5 shadow-card">
			<header>
				<h2 className="text-xl font-semibold text-brand">O que já está cadastrado</h2>
				<p className="text-sm text-ink-muted">
					Ao salvar, só o que ainda não existe é cadastrado. O que já existe é reaproveitado.
				</p>
			</header>

			<ul className="flex flex-col divide-y divide-line">
				{rows.map((row, i) => (
					<li key={i} className="flex flex-wrap items-center gap-3 py-2 text-sm">
						<span className="w-28 font-medium text-ink-muted">{row.label}</span>
						<span className="flex-1">{row.detail}</span>
						<Pill registered={row.registered} />
					</li>
				))}
				<li className="flex flex-wrap items-center gap-3 py-2 text-sm">
					<span className="w-28 font-medium text-ink-muted">Grade</span>
					<span className="flex-1">
						Será criada. Se o docente já tiver grade neste período, só as disciplinas e horários que faltam são adicionados.
					</span>
				</li>
			</ul>

			<p className="text-sm text-ink-muted">
				{toCreate === 0
					? "Nada novo para cadastrar além da grade."
					: `${toCreate} item(ns) serão cadastrados junto com a grade.`}
			</p>

			{error && (
				<p className="text-sm text-danger-fg" role="alert">
					{error}
				</p>
			)}

			<div className="flex justify-end">
				<button
					type="button"
					className="btn"
					disabled={isSaving || !errors}
					onClick={state.save}
				>
					{isSaving ? "Salvando grade..." : "Salvar grade"}
				</button>
			</div>
		</section>
	);
}