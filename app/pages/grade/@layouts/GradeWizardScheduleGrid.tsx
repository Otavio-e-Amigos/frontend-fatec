import { useEffect, useRef } from "react";
import formatTurno from "~/modules/curso/format-turno";
import type { GradeLessonPayload } from "~/modules/grade/grade.service";
import type Grade from "~/modules/grade/grade.class";
import {
  getAllocatedBlocks,
  getLessonBlocks,
  itemColors,
  shifts,
  weekDays,
  type Shift,
} from "./grade-wizard.utils";

type GradeWizardScheduleGridProps = {
  items: Grade[];
  selectedItem?: Grade;
  hasPersistedData: boolean;
  onAddLesson: (itemKey: string, lesson: GradeLessonPayload) => void;
  onRemoveLesson: (itemKey: string, lesson: GradeLessonPayload) => void;
};

/** Displays official shift blocks and supports adding lessons by clicking or dragging. */
export default function GradeWizardScheduleGrid({
  items,
  selectedItem,
  hasPersistedData,
  onAddLesson,
  onRemoveLesson,
}: GradeWizardScheduleGridProps) {
  const isDragging = useRef(false);
  const ignoreNextClick = useRef(false);

  useEffect(() => {
    /** Clears drag state after the pointer is released anywhere on the page. */
    function stopDragging() {
      isDragging.current = false;
      window.setTimeout(() => {
        ignoreNextClick.current = false;
      }, 0);
    }

    window.addEventListener("pointerup", stopDragging);
    return () => window.removeEventListener("pointerup", stopDragging);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {shifts.map((shift) => (
        <ShiftScheduleTable
          key={shift.value}
          shift={shift}
          items={items}
          selectedItem={selectedItem}
          hasPersistedData={hasPersistedData}
          isDragging={isDragging}
          ignoreNextClick={ignoreNextClick}
          onAddLesson={onAddLesson}
          onRemoveLesson={onRemoveLesson}
        />
      ))}
    </div>
  );
}

/** Displays one shift and applies click and drag interactions to its cells. */
function ShiftScheduleTable({
  shift,
  items,
  selectedItem,
  hasPersistedData,
  isDragging,
  ignoreNextClick,
  onAddLesson,
  onRemoveLesson,
}: {
  shift: Shift;
  items: Grade[];
  selectedItem?: Grade;
  hasPersistedData: boolean;
  isDragging: { current: boolean };
  ignoreNextClick: { current: boolean };
  onAddLesson: (itemKey: string, lesson: GradeLessonPayload) => void;
  onRemoveLesson: (itemKey: string, lesson: GradeLessonPayload) => void;
}) {
  return (
    <section className="overflow-hidden rounded-control border border-line">
      <h2 className="border-b border-line bg-surface-sunken px-3 py-2 text-sm font-semibold text-brand">
        {shift.label}
        {selectedItem && selectedItem.periodo !== shift.value && (
          <span className="ml-2 text-xs font-normal text-ink-muted">
            Bloqueado: a disciplina selecionada pertence ao turno{" "}
            {formatTurno(selectedItem.periodo)}.
          </span>
        )}
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-xs">
          <thead>
            <tr className="bg-surface-sunken text-ink-muted">
              <th className="w-28 border border-line px-2 py-2 text-left">
                Horário
              </th>
              {weekDays.slice(0, 6).map((weekday) => (
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
            {shift.slots.map((slot, slotIndex) => (
              <tr key={slot.start}>
                <th className="border border-line bg-surface-sunken px-2 py-2 text-left font-normal text-ink-muted">
                  {slot.start}–{slot.end}
                </th>
                {weekDays.slice(0, 6).map((weekday) => (
                  <ScheduleCell
                    key={`${weekday.value}-${slot.start}`}
                    shift={shift}
                    slot={slot}
                    slotIndex={slotIndex}
                    weekday={weekday}
                    items={items}
                    selectedItem={selectedItem}
                    hasPersistedData={hasPersistedData}
                    isDragging={isDragging}
                    ignoreNextClick={ignoreNextClick}
                    onAddLesson={onAddLesson}
                    onRemoveLesson={onRemoveLesson}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/** Renders an individual block and handles its add, remove, and drag actions. */
function ScheduleCell({
  shift,
  slot,
  slotIndex,
  weekday,
  items,
  selectedItem,
  hasPersistedData,
  isDragging,
  ignoreNextClick,
  onAddLesson,
  onRemoveLesson,
}: {
  shift: Shift;
  slot: { start: string; end: string };
  slotIndex: number;
  weekday: (typeof weekDays)[number];
  items: Grade[];
  selectedItem?: Grade;
  hasPersistedData: boolean;
  isDragging: { current: boolean };
  ignoreNextClick: { current: boolean };
  onAddLesson: (itemKey: string, lesson: GradeLessonPayload) => void;
  onRemoveLesson: (itemKey: string, lesson: GradeLessonPayload) => void;
}) {
  const scheduled = items.flatMap((item, index) => {
    if (item.periodo !== shift.value) return [];
    return item.aulas.flatMap((lesson) => {
      if (lesson.diaSemana !== weekday.value) return [];
      const blocks = getLessonBlocks(shift, lesson);
      return blocks.includes(slotIndex)
        ? [
            {
              item,
              index,
              lesson,
              isFirstBlock: blocks[0] === slotIndex,
            },
          ]
        : [];
    });
  })[0];
  const selectedCanAdd = Boolean(
    selectedItem &&
    selectedItem.periodo === shift.value &&
    getAllocatedBlocks(selectedItem) < selectedItem.quantidadeAulas,
  );
  const color = scheduled
    ? itemColors[scheduled.index % itemColors.length]
    : undefined;
  const lesson = {
    diaSemana: weekday.value,
    horaInicio: slot.start,
    horaFim: slot.end,
  };

  return (
    <td className="h-10 border border-line p-0">
      <button
        type="button"
        className="grid h-full min-h-10 w-full place-items-center px-1 text-center disabled:cursor-not-allowed disabled:bg-surface-sunken/40"
        style={
          color
            ? {
                backgroundColor: `color-mix(in srgb, ${color} 12%, white)`,
                color,
              }
            : undefined
        }
        disabled={hasPersistedData || (!scheduled && !selectedCanAdd)}
        title={
          scheduled
            ? `${scheduled.item.disciplina}: ${scheduled.lesson.horaInicio}–${scheduled.lesson.horaFim}. Clique para remover.`
            : selectedCanAdd && selectedItem
              ? `Adicionar ${selectedItem.disciplina}`
              : selectedItem
                ? selectedItem.periodo === shift.value
                  ? `${selectedItem.disciplina} já atingiu a carga semanal informada.`
                  : `A grade só pode ser preenchida no turno ${formatTurno(selectedItem.periodo)}.`
                : "Selecione uma disciplina para preencher a grade."
        }
        aria-label={
          scheduled
            ? `${scheduled.item.disciplina}, ${weekday.label} ${scheduled.lesson.horaInicio} a ${scheduled.lesson.horaFim}. Clique para remover`
            : selectedCanAdd && selectedItem
              ? `Adicionar ${selectedItem.disciplina}, ${weekday.label} ${slot.start} a ${slot.end}`
              : selectedItem?.periodo === shift.value
                ? `Carga semanal de ${selectedItem.disciplina} completa`
                : `Horário bloqueado. Selecione uma disciplina do turno ${shift.label}`
        }
        onPointerDown={(event) => {
          if (
            event.button !== 0 ||
            scheduled ||
            !selectedCanAdd ||
            !selectedItem
          ) {
            return;
          }
          isDragging.current = true;
          ignoreNextClick.current = true;
          onAddLesson(selectedItem.key, lesson);
        }}
        onPointerEnter={() => {
          if (
            !isDragging.current ||
            scheduled ||
            !selectedCanAdd ||
            !selectedItem
          ) {
            return;
          }
          onAddLesson(selectedItem.key, lesson);
        }}
        onClick={() => {
          if (ignoreNextClick.current) {
            ignoreNextClick.current = false;
            return;
          }
          if (scheduled) {
            onRemoveLesson(scheduled.item.key, scheduled.lesson);
          } else if (selectedCanAdd && selectedItem) {
            onAddLesson(selectedItem.key, lesson);
          }
        }}
      >
        {scheduled && (
          <span
            className="max-w-full truncate rounded border px-1.5 py-0.5 font-medium"
            style={{ borderColor: color }}
          >
            {scheduled.isFirstBlock ? scheduled.item.disciplina : "Continuação"}
          </span>
        )}
      </button>
    </td>
  );
}
