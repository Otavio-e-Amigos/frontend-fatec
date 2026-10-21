import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import Header from "~/layouts/Header";
import type Curso from "~/modules/curso/curso.class";
import formatTurno from "~/modules/curso/format-turno";
import type Disciplina from "~/modules/disciplina/disciplina.class";
import type PeriodoLetivo from "~/modules/periodo-letivo/periodo-letivo.class";
import type Professor from "~/modules/professor/professor.class";
import type Grade from "~/modules/grade/grade.class";
import AuthService from "~/modules/user/auth.service";
import GradeService, {
  type GradeDisciplinePayload,
  type GradeLessonPayload,
} from "~/modules/grade/grade.service";
import {
  academicMonths,
  getAllocatedBlocks,
  getItemsTotals,
  getLessonBlocks,
  roundHours,
  shifts,
  timeInMinutes,
} from "./@layouts/grade-wizard.utils";
import GradeWizardDisciplineStep from "./@layouts/GradeWizardDisciplineStep";
import GradeWizardNavigation from "./@layouts/GradeWizardNavigation";
import GradeWizardScheduleStep from "./@layouts/GradeWizardScheduleStep";
import GradeWizardSummary from "./@layouts/GradeWizardSummary";
import GenericFloor from "~/layouts/pages/GenericFloor";

type GradeWizardProps = {
  professor: Professor;
  cursos: Curso[];
  disciplinas: Disciplina[];
  periodos: PeriodoLetivo[];
  opOptions: number[];
  opOptionsError?: string;
};

type PersistedItem = {
  id: number;
  aulasSalvas: Set<number>;
};

type SaveProgress = {
  gradeId?: number;
  itens: Record<string, PersistedItem>;
};

/** Coordinates the grade registration flow, validation, and persistence. */
export default function GradeWizard({
  professor,
  cursos,
  disciplinas,
  periodos,
  opOptions,
  opOptionsError,
}: GradeWizardProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [periodoId, setPeriodoId] = useState("");
  const [items, setItems] = useState<Grade[]>([]);
  const [selectedItemKey, setSelectedItemKey] = useState("");
  const [day, setDay] = useState("1");
  const [manualStart, setManualStart] = useState("13:00");
  const [manualEnd, setManualEnd] = useState("13:50");
  const [itemError, setItemError] = useState("");
  const [scheduleError, setScheduleError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [hasPersistedData, setHasPersistedData] = useState(false);
  const progress = useRef<SaveProgress>({ itens: {} });

  const selectedPeriod = periodos.find((item) => String(item.id) === periodoId);
  const selectedItem = items.find((item) => item.key === selectedItemKey);

  /** Adds a validated discipline and selects it for schedule editing. */
  function handleItemAdded(newItem: Grade) {
    setItems((current) => [...current, newItem]);
    setSelectedItemKey(newItem.key);
    setItemError("");
    const selectedShift = shifts.find(
      (entry) => entry.value === newItem.periodo,
    );
    if (selectedShift) {
      setManualStart(selectedShift.slots[0].start);
      setManualEnd(selectedShift.slots[0].end);
    }
  }

  /** Removes a discipline and chooses a remaining one when necessary. */
  function removeItem(key: string) {
    if (hasPersistedData) return;
    const remainingItems = items.filter((item) => item.key !== key);
    setItems(remainingItems);
    if (selectedItemKey === key) {
      setSelectedItemKey(remainingItems[0]?.key ?? "");
    }
  }

  /** Removes one scheduled lesson from its discipline. */
  function removeLesson(itemKey: string, lesson: GradeLessonPayload) {
    if (hasPersistedData) return;
    setItems((current) =>
      current.map((entry) =>
        entry.key === itemKey
          ? {
              ...entry,
              aulas: entry.aulas.filter(
                (scheduled) =>
                  scheduled.diaSemana !== lesson.diaSemana ||
                  scheduled.horaInicio !== lesson.horaInicio ||
                  scheduled.horaFim !== lesson.horaFim,
              ),
            }
          : entry,
      ),
    );
    setScheduleError("");
  }

  /** Selects the discipline and resets the manual fields to its first block. */
  function selectScheduleItem(key: string) {
    setSelectedItemKey(key);
    const item = items.find((entry) => entry.key === key);
    const shift = shifts.find((entry) => entry.value === item?.periodo);
    if (shift) {
      setManualStart(shift.slots[0].start);
      setManualEnd(shift.slots[0].end);
    }
  }

  /** Validates and adds a lesson to the selected discipline's schedule. */
  function addLesson(itemKey: string, lesson: GradeLessonPayload) {
    const item = items.find((entry) => entry.key === itemKey);
    if (!item || hasPersistedData) return;
    const start = timeInMinutes(lesson.horaInicio);
    const end = timeInMinutes(lesson.horaFim);

    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
      setScheduleError(
        "O horário final deve ser posterior ao horário inicial.",
      );
      return;
    }
    const shift = shifts.find((entry) => entry.value === item.periodo);
    if (!shift || start < shift.minStart || end > shift.maxEnd) {
      setScheduleError(
        `O horário precisa estar dentro do turno ${formatTurno(item.periodo)}.`,
      );
      return;
    }
    const occupiedBlocks = getLessonBlocks(shift, lesson);
    if (!occupiedBlocks.length) {
      setScheduleError("A aula não cabe nos blocos disponíveis deste turno.");
      return;
    }

    const existingLesson = items
      .flatMap((entry) =>
        entry.aulas.map((scheduled) => ({ entry, scheduled })),
      )
      .find(({ scheduled }) => {
        if (scheduled.diaSemana !== lesson.diaSemana) return false;
        return (
          start < timeInMinutes(scheduled.horaFim) &&
          end > timeInMinutes(scheduled.horaInicio)
        );
      });

    if (existingLesson) {
      setScheduleError(
        `Este horário já está ocupado por ${existingLesson.entry.disciplina}.`,
      );
      return;
    }
    const conflictingBlock = items
      .flatMap((entry) =>
        entry.aulas.map((scheduled) => ({
          entry,
          scheduled,
          shift: shifts.find((candidate) => candidate.value === entry.periodo),
        })),
      )
      .find(({ entry, scheduled, shift: scheduledShift }) => {
        if (
          entry.periodo !== item.periodo ||
          scheduled.diaSemana !== lesson.diaSemana ||
          !scheduledShift
        ) {
          return false;
        }
        return getLessonBlocks(scheduledShift, scheduled).some((block) =>
          occupiedBlocks.includes(block),
        );
      });
    if (conflictingBlock) {
      setScheduleError(
        `Este horário corresponde a um bloco já ocupado por ${conflictingBlock.entry.disciplina}.`,
      );
      return;
    }

    const allocatedBlocks = getAllocatedBlocks(item);
    if (allocatedBlocks + occupiedBlocks.length > item.quantidadeAulas) {
      setScheduleError(
        `${item.disciplina} permite ${item.quantidadeAulas} bloco(s) semanal(is) de 50 minutos; este horário ultrapassaria esse limite.`,
      );
      return;
    }

    setItems((current) =>
      current.map((entry) =>
        entry.key === itemKey
          ? {
              ...entry,
              aulas: [...entry.aulas, lesson].sort(
                (a, b) =>
                  a.diaSemana - b.diaSemana ||
                  timeInMinutes(a.horaInicio) - timeInMinutes(b.horaInicio),
              ),
            }
          : entry,
      ),
    );
    setScheduleError("");
  }

  /** Adds a lesson using the manually entered weekday and times. */
  function addManualLesson() {
    if (!selectedItem) {
      setScheduleError(
        "Selecione uma disciplina antes de adicionar um horário.",
      );
      return;
    }
    addLesson(selectedItem.key, {
      diaSemana: Number(day),
      horaInicio: manualStart,
      horaFim: manualEnd,
    });
  }

  /** Validates the first step before opening the schedule editor. */
  function proceedToSchedule() {
    if (!selectedPeriod) {
      setItemError("Selecione o período letivo antes de continuar.");
      return;
    }
    if (!items.length) {
      setItemError("Adicione pelo menos uma disciplina à grade.");
      return;
    }
    setItemError("");
    setStep(2);
  }

  /** Checks weekly block totals before displaying the hour summary. */
  function proceedToSummary() {
    const missing = items.find(
      (item) => getAllocatedBlocks(item) !== item.quantidadeAulas,
    );
    if (missing) {
      setScheduleError(
        `${missing.disciplina}: aloque ${missing.quantidadeAulas} bloco(s) de 50 minutos por semana; há ${getAllocatedBlocks(missing)}.`,
      );
      return;
    }
    setScheduleError("");
    setStep(3);
  }

  /** Saves the grade and resumes partial saves without duplicating records. */
  async function saveGrade() {
    if (!professor.id || !selectedPeriod?.id) {
      setSaveError(
        "Não foi possível identificar o professor ou período letivo.",
      );
      return;
    }
    if (isSaving) return;

    setIsSaving(true);
    setSaveError("");
    try {
      const totals = items.reduce(
        (result, item) => {
          const itemTotals = getItemsTotals(
            item,
            academicMonths(selectedPeriod),
          );
          return {
            weekly: result.weekly + itemTotals.weekly,
            monthly: result.monthly + itemTotals.monthly,
            total: result.total + itemTotals.monthlyTotal,
          };
        },
        { weekly: 0, monthly: 0, total: 0 },
      );

      if (!progress.current.gradeId) {
        progress.current.gradeId = await GradeService.createGrade(
          {
            professorId: professor.id,
            periodoLetivoId: selectedPeriod.id,
            semanal: roundHours(totals.weekly),
            mensal: roundHours(totals.monthly),
            total: roundHours(totals.total),
          },
          AuthService.getUserToken(),
        );
        setHasPersistedData(true);
      }

      for (const item of items) {
        let savedItem = progress.current.itens[item.key];
        if (!savedItem) {
          const payload: GradeDisciplinePayload = {
            gradeId: progress.current.gradeId,
            disciplinaId: item.disciplinaId,
            cursoId: item.cursoId,
            semestreCurso: item.semestreCurso,
            periodo: item.periodo,
            quantidadeAulas: item.quantidadeAulas,
            op: item.op,
            status: "MINISTRANDO",
          };
          savedItem = {
            id: await GradeService.createDiscipline(
              payload,
              AuthService.getUserToken(),
            ),
            aulasSalvas: new Set<number>(),
          };
          progress.current.itens[item.key] = savedItem;
          setHasPersistedData(true);
        }

        for (const [index, lesson] of item.aulas.entries()) {
          if (savedItem.aulasSalvas.has(index)) continue;
          await GradeService.createLesson(
            savedItem.id,
            lesson,
            AuthService.getUserToken(),
          );
          savedItem.aulasSalvas.add(index);
        }
      }

      navigate(`/professor/${professor.id}`);
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar a grade. Tente novamente.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  const months = selectedPeriod ? academicMonths(selectedPeriod) : 6;
  const totals = items.reduce(
    (result, item) => {
      const itemTotals = getItemsTotals(item, months);
      return {
        lessons: result.lessons + item.quantidadeAulas,
        weekly: result.weekly + itemTotals.weekly,
        monthly: result.monthly + itemTotals.monthly,
        activity: result.activity + itemTotals.activity,
        monthlyTotal: result.monthlyTotal + itemTotals.monthlyTotal,
        semester: result.semester + itemTotals.semester,
      };
    },
    {
      lessons: 0,
      weekly: 0,
      monthly: 0,
      activity: 0,
      monthlyTotal: 0,
      semester: 0,
    },
  );
  return (
    <div className="flex min-h-screen flex-col">
			<Header activeItem="Professores" />

			{/*<main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-6">*/}
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-6">
	        <GradeWizardNavigation
	          step={step}
	          professorId={professor.id}
	          isSaving={isSaving}
	          hasPersistedData={hasPersistedData}
	          onBack={() => setStep((current) => current - 1)}
	          onNext={step === 1 ? proceedToSchedule : proceedToSummary}
	          onSave={saveGrade}
	        />

				<GenericFloor>
	        {step === 1 && (
	          <GradeWizardDisciplineStep
	            professor={professor}
	            cursos={cursos}
	            disciplinas={disciplinas}
	            periodos={periodos}
	            opOptions={opOptions}
	            opOptionsError={opOptionsError}
	            periodoId={periodoId}
	            onPeriodChange={setPeriodoId}
	            items={items}
	            onItemAdded={handleItemAdded}
	            onRemoveItem={removeItem}
	            itemError={itemError}
	            onItemError={setItemError}
	            hasPersistedData={hasPersistedData}
	          />
	        )}

	        {step === 2 && (
	          <GradeWizardScheduleStep
	            items={items}
	            selectedItemKey={selectedItemKey}
	            selectedItem={selectedItem}
	            day={day}
	            manualStart={manualStart}
	            manualEnd={manualEnd}
	            scheduleError={scheduleError}
	            hasPersistedData={hasPersistedData}
	            onSelectItem={selectScheduleItem}
	            onDayChange={setDay}
	            onManualStartChange={setManualStart}
	            onManualEndChange={setManualEnd}
	            onAddManualLesson={addManualLesson}
	            onAddLesson={addLesson}
	            onRemoveLesson={removeLesson}
	          />
	        )}

	        {step === 3 && selectedPeriod && (
	          <GradeWizardSummary
	            items={items}
	            professor={professor}
	            selectedPeriod={selectedPeriod}
	            months={months}
	            totals={totals}
	            saveError={saveError}
	            hasPersistedData={hasPersistedData}
	          />
	        )}
	      </GenericFloor>
      </main>
    </div>
  );
}
