import formatTurno from "~/modules/curso/format-turno";
import type { ScheduleDiscipline } from "../grade-page.types";
import { scheduleColors, shifts, weekdays } from "../grade-page.utils";

/** Renders lessons as a weekly table grouped by course shift. */
export default function GradeWeeklySchedule({
	schedule,
}: {
	schedule: ScheduleDiscipline[];
}) {
	return (
		<div className="flex flex-col gap-4">
			{shifts.map((shift) => {
				const shiftDisciplines = schedule.filter(
					(discipline) => discipline.shift === shift,
				);
				if (!shiftDisciplines.length) return null;

				return (
					<div
						key={shift}
						className="overflow-x-auto rounded-control border border-line"
					>
						<table className="w-full min-w-[760px] border-collapse text-xs">
							<thead>
								<tr className="bg-surface-sunken text-ink-muted">
									<th className="w-24 border border-line px-3 py-2 text-left">
										{formatTurno(shift)}
									</th>
									{weekdays.map((weekday) => (
										<th
											key={weekday.value}
											className="border border-line px-2 py-2"
										>
											{weekday.label}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								<tr>
									<th className="border border-line bg-surface-sunken px-3 py-2 text-left font-normal text-ink-muted">
										Aulas
									</th>
									{weekdays.map((weekday) => (
										<td
											key={weekday.value}
											className="min-w-28 border border-line p-1 align-top"
										>
											<LessonCell
												weekday={weekday.value}
												disciplines={shiftDisciplines}
												allDisciplines={schedule}
											/>
										</td>
									))}
								</tr>
							</tbody>
						</table>
					</div>
				);
			})}
		</div>
	);
}

/** Draws lessons for one weekday cell in chronological order. */
function LessonCell({
	weekday,
	disciplines,
	allDisciplines,
}: {
	weekday: number;
	disciplines: ScheduleDiscipline[];
	allDisciplines: ScheduleDiscipline[];
}) {
	const lessons = disciplines
		.flatMap((discipline) =>
			discipline.lessons
				.filter((lesson) => lesson.diaSemana === weekday)
				.map((lesson) => ({ lesson, discipline })),
		)
		.sort((a, b) =>
			a.lesson.horaInicio.localeCompare(b.lesson.horaInicio),
		);

	if (!lessons.length) return <span className="text-ink-muted">—</span>;

	return (
		<div className="flex flex-col gap-1">
			{lessons.map(({ lesson, discipline }) => {
				const color =
					scheduleColors[
						allDisciplines.indexOf(discipline) % scheduleColors.length
					];
				return (
					<div
						key={lesson.id}
						className="rounded border px-1.5 py-1"
						style={{
							borderColor: color,
							backgroundColor: `color-mix(in srgb, ${color} 12%, white)`,
							color,
						}}
						title={`${discipline.name} — ${discipline.course} (${formatTurno(discipline.shift)})`}
					>
						<strong className="block font-medium">
							{lesson.horaInicio.slice(0, 5)}–{lesson.horaFim.slice(0, 5)}
						</strong>
						<span className="block truncate">{discipline.name}</span>
					</div>
				);
			})}
		</div>
	);
}
