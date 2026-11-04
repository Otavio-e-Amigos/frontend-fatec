import { mergeLessons } from "~/modules/grade/extraction/grade-extraction.save";
import {
	courseKey,
	disciplineKey,
	findCourse,
	findDiscipline,
} from "~/modules/grade/extraction/grade-extraction.registry";
import {
	PERIOD_OPTIONS,
	STATUS_OPTIONS,
	WEEKDAY_OPTIONS,
	weekdayLabel,
} from "~/modules/grade/extraction/grade-extraction.types";
import type { GradeImportState } from "../@hooks/useGradeImport";
import { Field, NumberInput, SelectInput, TextInput } from "./GradeImportFields";

const grid = "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4";

/** One extracted discipline: its data, lessons and the complementary fields for what will be created. */
export default function GradeImportDisciplineCard({
	state, index,
}: { state: GradeImportState; index: number }) {
	const { data, errors, extras, registry } = state;
	if (!data || !errors) return null;

	const item = data.disciplinas[index];
	const e = errors.fields;
	const base = `disciplinas.${index}`;

	const ck = courseKey(item.curso, item.periodo);
	const dk = disciplineKey(item.nome);
	const courseComplete =
		item.curso.trim() !== "" && PERIOD_OPTIONS.some((option) => option.value === item.periodo);
	const needsCourse = courseComplete && !findCourse(registry, item.curso, item.periodo);
	const needsDiscipline = item.nome.trim() !== "" && !findDiscipline(registry, item.nome);
	const merged = mergeLessons(item.aulas);

	return (
		<div className="flex flex-col gap-3 rounded-lg border border-line p-4">
			<div className={grid}>
				<Field label="Disciplina" required error={e[`${base}.nome`]}>
					<TextInput value={item.nome} error={e[`${base}.nome`]}
						onChange={(value) => state.updateDiscipline(index, { nome: value })} />
				</Field>
				<Field label="Curso" required error={e[`${base}.curso`]}>
					<TextInput value={item.curso} error={e[`${base}.curso`]}
						onChange={(value) => state.updateDiscipline(index, { curso: value })} />
				</Field>
				<Field label="Turno do curso" required error={e[`${base}.periodo`]}>
					<SelectInput value={item.periodo} options={PERIOD_OPTIONS} error={e[`${base}.periodo`]}
						onChange={(value) => state.updateDiscipline(index, { periodo: value })} />
				</Field>
				<Field label="Status" required error={e[`${base}.status`]}>
					<SelectInput value={item.status} options={STATUS_OPTIONS} error={e[`${base}.status`]}
						onChange={(value) => state.updateDiscipline(index, { status: value })} />
				</Field>
				<Field label="Qtde. de aulas (50 min)" required error={e[`${base}.quantidadeAulas`]}>
					<NumberInput value={item.quantidadeAulas} error={e[`${base}.quantidadeAulas`]}
						onChange={(value) => state.updateDiscipline(index, { quantidadeAulas: value })} />
				</Field>
				<Field label="OP">
					<NumberInput value={item.op}
						onChange={(value) => state.updateDiscipline(index, { op: value })} />
				</Field>
			</div>

			{(needsCourse || needsDiscipline) && (
				<div className={grid}>
					{needsCourse && (
						<Field label="Sigla do curso (novo)" required error={e[`extras.course.${ck}`]}>
							<TextInput maxLength={10} value={extras.courseAcronyms[ck] ?? ""} error={e[`extras.course.${ck}`]}
								onChange={(value) => state.updateExtraEntry("courseAcronyms", ck, value.toUpperCase())} />
						</Field>
					)}
					{needsDiscipline && (
						<>
							<Field label="Código da disciplina (nova)" required error={e[`extras.disciplineCode.${dk}`]}>
								<TextInput maxLength={10} value={extras.disciplineCodes[dk] ?? ""} error={e[`extras.disciplineCode.${dk}`]}
									onChange={(value) => state.updateExtraEntry("disciplineCodes", dk, value)} />
							</Field>
							<Field label="Sigla da disciplina (nova)" required error={e[`extras.disciplineAcronym.${dk}`]}>
								<TextInput maxLength={10} value={extras.disciplineAcronyms[dk] ?? ""} error={e[`extras.disciplineAcronym.${dk}`]}
									onChange={(value) => state.updateExtraEntry("disciplineAcronyms", dk, value.toUpperCase())} />
							</Field>
						</>
					)}
				</div>
			)}

			<div className="flex flex-col gap-2">
				<p className="text-sm font-medium text-ink-muted">Horários</p>
				{item.aulas.map((lesson, lessonIndex) => {
					const path = `${base}.aulas.${lessonIndex}`;
					return (
						<div key={lessonIndex} className="grid grid-cols-1 items-start gap-3 sm:grid-cols-[2fr_1fr_1fr_auto]">
							<Field label="Dia" error={e[`${path}.diaSemana`]}>
								<SelectInput options={WEEKDAY_OPTIONS} error={e[`${path}.diaSemana`]}
									value={lesson.diaSemana == null ? "" : String(lesson.diaSemana)}
									onChange={(value) => state.updateLesson(index, lessonIndex, { diaSemana: value ? Number(value) : null })} />
							</Field>
							<Field label="Início" error={e[`${path}.horaInicio`]}>
								<TextInput type="time" value={lesson.horaInicio} error={e[`${path}.horaInicio`]}
									onChange={(value) => state.updateLesson(index, lessonIndex, { horaInicio: value })} />
							</Field>
							<Field label="Término" error={e[`${path}.horaFim`]}>
								<TextInput type="time" value={lesson.horaFim} error={e[`${path}.horaFim`]}
									onChange={(value) => state.updateLesson(index, lessonIndex, { horaFim: value })} />
							</Field>
							<button type="button" className="btn mt-5" data-variant="outline"
								onClick={() => state.removeLesson(index, lessonIndex)}>
								Remover
							</button>
						</div>
					);
				})}
				{merged.length > 0 && (
					<p className="text-xs text-ink-muted">
						Será salvo como:{" "}
						{merged.map((lesson) => `${weekdayLabel(lesson.diaSemana)} ${lesson.horaInicio}–${lesson.horaFim}`).join(" · ")}
					</p>
				)}
				<div className="flex gap-2">
					<button type="button" className="btn" data-variant="outline" onClick={() => state.addLesson(index)}>
						Adicionar horário
					</button>
					<button type="button" className="btn" data-variant="outline" onClick={() => state.removeDiscipline(index)}>
						Remover disciplina
					</button>
				</div>
			</div>
		</div>
	);
}