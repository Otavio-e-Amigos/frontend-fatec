import { Link } from "react-router";
import GenericFloor from "~/layouts/pages/GenericFloor";
import type Curso from "~/modules/curso/curso.class";
import type Disciplina from "~/modules/disciplina/disciplina.class";
import type PeriodoLetivo from "~/modules/periodo-letivo/periodo-letivo.class";
import GradeWeeklySchedule from "~/pages/grade/@layouts/GradeWeeklySchedule";
import useProfessorGrades from "../@hooks/useProfessorGrades";

type ProfessorGradesPanelProps = {
	professorId: number;
	periodos: PeriodoLetivo[];
	cursos: Curso[];
	disciplinas: Disciplina[];
};

function StateMessage({
	message,
	hint,
	action,
}: {
	message: string;
	hint?: string;
	action?: React.ReactNode;
}) {
	return (
		<div className="empty-state">
			<p>{message}</p>
			{hint && <p>{hint}</p>}
			{action}
		</div>
	);
}

export default function ProfessorGradesPanel({
	professorId,
	periodos,
	cursos,
	disciplinas,
}: ProfessorGradesPanelProps) {
	const state = useProfessorGrades({ professorId, periodos, cursos, disciplinas });
	const { selectedGrade } = state;

	const header = (
		<div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
			<div className="flex flex-col">
				<h2 className="text-xl font-bold text-red-950">Grades horárias</h2>
				<p className="text-xs text-brand-shade">
					Horários do professor por período letivo.
				</p>
			</div>

			{state.grades.length > 1 && selectedGrade && (
				<select
					aria-label="Período da grade"
					className="rounded-control border border-line bg-surface px-2 py-1 text-sm text-ink"
					value={selectedGrade.id}
					onChange={(event) => state.selectGrade(Number(event.target.value))}
				>
					{state.grades.map((grade) => (
						<option key={grade.id} value={grade.id}>
							{state.gradeLabel(grade)}
						</option>
					))}
				</select>
			)}
		</div>
	);

	let body: React.ReactNode;

	if (state.loadingGrades) {
		body = <p className="text-sm text-ink-muted">Carregando grades...</p>;
	} else if (state.gradesError) {
		body = (
			<StateMessage
				message={state.gradesError}
				action={
					<button
						type="button"
						className="btn mt-2"
						data-variant="outline"
						data-size="sm"
						onClick={state.retry}
					>
						Tentar novamente
					</button>
				}
			/>
		);
	} else if (!selectedGrade) {
		body = (
			<StateMessage
				message="Nenhuma grade cadastrada"
				hint="Crie a primeira grade horária deste professor."
				action={
					<Link
						className="btn mt-2"
						data-variant="outline"
						data-size="sm"
						to={`/professor/${professorId}/grades/new`}
					>
						Criar grade horária
					</Link>
				}
			/>
		);
	} else {
		body = (
			<div className="flex flex-col gap-4">
				<div className="flex flex-wrap items-center gap-2">
					<span className="chip">Semanal: {selectedGrade.semanal}</span>
					<span className="chip">Mensal: {selectedGrade.mensal}</span>
					<span className="chip">Total: {selectedGrade.total}</span>
					{!state.loadingSchedule && !state.scheduleError && (
						<span className="chip">Disciplinas: {state.schedule.length}</span>
					)}
					<Link className="link ml-auto text-sm" to="/grade">
						Gerenciar na página de grades
					</Link>
				</div>

				{state.loadingSchedule ? (
					<p className="text-sm text-ink-muted">Carregando horários...</p>
				) : state.scheduleError ? (
					<StateMessage
						message={state.scheduleError}
						action={
							<button
								type="button"
								className="btn mt-2"
								data-variant="outline"
								data-size="sm"
								onClick={state.retry}
							>
								Tentar novamente
							</button>
						}
					/>
				) : state.schedule.length ? (
					<GradeWeeklySchedule schedule={state.schedule} />
				) : (
					<StateMessage message="Esta grade ainda não tem disciplinas." />
				)}
			</div>
		);
	}

	return (
		<GenericFloor className="p-4" header={header}>
			{body}
		</GenericFloor>
	);
}