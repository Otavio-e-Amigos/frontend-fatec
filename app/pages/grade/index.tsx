import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import Header from "~/layouts/Header";
import type Curso from "~/modules/curso/curso.class";
import formatTurno from "~/modules/curso/format-turno";
import type Disciplina from "~/modules/disciplina/disciplina.class";
import type PeriodoLetivo from "~/modules/periodo-letivo/periodo-letivo.class";
import type Professor from "~/modules/professor/professor.class";
import GradeService, {
  type SavedGrade,
  type SavedGradeLesson,
} from "~/modules/grade/grade.service";
import AuthService from "~/modules/user/auth.service";

type GradePageProps = {
  professores: Professor[];
  periodos: PeriodoLetivo[];
  cursos: Curso[];
  disciplinas: Disciplina[];
};

type ScheduleDiscipline = {
  name: string;
  course: string;
  shift: string;
  lessons: SavedGradeLesson[];
};

const weekdays = [
  { value: 1, label: "Segunda" },
  { value: 2, label: "Terça" },
  { value: 3, label: "Quarta" },
  { value: 4, label: "Quinta" },
  { value: 5, label: "Sexta" },
  { value: 6, label: "Sábado" },
];

const shifts = ["MANHA", "TARDE", "NOITE"];
const scheduleColors = [
  "var(--color-brand)",
  "var(--color-warn-fg)",
  "var(--color-brand-shade)",
  "var(--color-danger-fg)",
];

function academicKey(period?: PeriodoLetivo) {
  return (period?.ano ?? 0) * 10 + (period?.semestre ?? 0);
}

function periodLabel(period?: PeriodoLetivo) {
  return period
    ? `${period.semestre}º semestre de ${period.ano}`
    : "Período letivo não encontrado";
}

function displayDay(day: number) {
  return (
    weekdays.find((weekday) => weekday.value === day)?.label ?? `Dia ${day}`
  );
}

export default function GradePage({
  professores,
  periodos,
  cursos,
  disciplinas,
}: GradePageProps) {
  const latestPeriod = [...periodos].sort(
    (a, b) => academicKey(b) - academicKey(a),
  )[0];
  const [professorQuery, setProfessorQuery] = useState("");
  const [professorId, setProfessorId] = useState("");
  const [showProfessorSuggestions, setShowProfessorSuggestions] =
    useState(false);
  const [periodId, setPeriodId] = useState(String(latestPeriod?.id ?? ""));
  const [grades, setGrades] = useState<SavedGrade[]>([]);
  const [gradeId, setGradeId] = useState("");
  const [schedule, setSchedule] = useState<ScheduleDiscipline[]>([]);
  const [loadingGrades, setLoadingGrades] = useState(false);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [gradesError, setGradesError] = useState("");
  const [scheduleError, setScheduleError] = useState("");
  const [retrySchedule, setRetrySchedule] = useState(0);

  const professor = professores.find(
    (entry) => String(entry.id) === professorId,
  );
  const selectedPeriod = periodos.find(
    (entry) => String(entry.id) === periodId,
  );
  const selectedGrade = grades.find((entry) => String(entry.id) === gradeId);
  const gradesForPeriod = useMemo(
    () => grades.filter((grade) => String(grade.periodoLetivoId) === periodId),
    [grades, periodId],
  );
  const matchingProfessors = useMemo(() => {
    const term = professorQuery.trim().toLocaleLowerCase("pt-BR");
    return professores.filter((entry) =>
      entry.name?.toLocaleLowerCase("pt-BR").includes(term),
    );
  }, [professores, professorQuery]);
  const professorNotFound =
    professorQuery.trim().length >= 2 &&
    !matchingProfessors.length &&
    !professorId;

  useEffect(() => {
    if (!professorId) {
      setGrades([]);
      setGradeId("");
      setGradesError("");
      return;
    }

    let active = true;
    setLoadingGrades(true);
    setGradesError("");
    setGrades([]);
    setGradeId("");

    GradeService.getProfessorGrades(
      Number(professorId),
      AuthService.getUserToken(),
    )
      .then((result) => {
        if (!active) return;
        const ordered = result.sort((a, b) => {
          const periodA = periodos.find(
            (period) => period.id === a.periodoLetivoId,
          );
          const periodB = periodos.find(
            (period) => period.id === b.periodoLetivoId,
          );
          return academicKey(periodB) - academicKey(periodA) || b.id - a.id;
        });
        setGrades(ordered);
        if (ordered.length) {
          const recent = ordered[0];
          setPeriodId(String(recent.periodoLetivoId));
          setGradeId(String(recent.id));
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setGradesError(
            error instanceof Error
              ? error.message
              : "Não foi possível consultar as grades deste professor.",
          );
        }
      })
      .finally(() => {
        if (active) setLoadingGrades(false);
      });

    return () => {
      active = false;
    };
  }, [professorId, periodos]);

  useEffect(() => {
    if (!grades.length || !periodId) {
      setGradeId("");
      return;
    }
    const currentGradeIsVisible = gradesForPeriod.some(
      (grade) => String(grade.id) === gradeId,
    );
    if (!currentGradeIsVisible) {
      setGradeId(String(gradesForPeriod[0]?.id ?? ""));
    }
  }, [gradeId, grades, gradesForPeriod, periodId]);

  useEffect(() => {
    if (!selectedGrade) {
      setSchedule([]);
      setScheduleError("");
      return;
    }
    const gradeToLoad = selectedGrade;

    let active = true;
    setLoadingSchedule(true);
    setScheduleError("");
    setSchedule([]);

    async function loadSchedule() {
      try {
        const gradeDisciplines = await GradeService.getGradeDisciplines(
          gradeToLoad.id,
          AuthService.getUserToken(),
        );
        const results = await Promise.all(
          gradeDisciplines.map(async (entry) => {
            const [lessons] = await Promise.all([
              GradeService.getDisciplineLessons(
                entry.id,
                AuthService.getUserToken(),
              ),
            ]);
            return {
              name:
                disciplinas.find(
                  (discipline) => discipline.id === entry.disciplinaId,
                )?.nome ?? `Disciplina ${entry.disciplinaId}`,
              course:
                cursos.find((course) => course.id === entry.cursoId)?.nome ??
                `Curso ${entry.cursoId}`,
              shift: entry.periodo,
              lessons,
            };
          }),
        );
        if (active) setSchedule(results);
      } catch (error) {
        if (active) {
          setScheduleError(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar os horários desta grade.",
          );
        }
      } finally {
        if (active) setLoadingSchedule(false);
      }
    }

    void loadSchedule();
    return () => {
      active = false;
    };
  }, [selectedGrade, disciplinas, cursos, retrySchedule]);

  function selectProfessor(professor: Professor) {
    setProfessorQuery(professor.name ?? "");
    setProfessorId(professor.id ? String(professor.id) : "");
    setShowProfessorSuggestions(false);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header activeItem="Grade" />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-5 px-4 py-6">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">
              Gestão acadêmica
            </p>
            <h1 className="mt-1 text-3xl font-semibold text-ink">Grades</h1>
            <p className="mt-1 text-sm text-ink-muted">
              Consulte a grade de um professor ou cadastre uma nova.
            </p>
          </div>
          <Link className="btn" data-variant="outline" to="/professor">
            Ver professores
          </Link>
        </header>

        <section className="surface rounded-card border border-line p-5">
          <h2 className="font-semibold text-ink">
            Selecione os dados da grade
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Ao escolher um professor, a grade mais recente é carregada
            automaticamente.
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="relative flex flex-col gap-1 text-xs font-medium text-ink-muted">
              Professor
              <input
                className="form-input w-full"
                type="text"
                autoComplete="off"
                placeholder="Digite o nome do professor"
                value={professorQuery}
                aria-expanded={showProfessorSuggestions}
                aria-controls="grade-professor-results"
                onFocus={() => setShowProfessorSuggestions(true)}
                onBlur={() =>
                  window.setTimeout(
                    () => setShowProfessorSuggestions(false),
                    120,
                  )
                }
                onChange={(event) => {
                  setProfessorQuery(event.currentTarget.value);
                  setProfessorId("");
                  setShowProfessorSuggestions(true);
                }}
              />
              {showProfessorSuggestions && (
                <div
                  id="grade-professor-results"
                  className="absolute inset-x-0 top-full z-20 mt-1 overflow-hidden rounded-control border border-line bg-surface shadow-lg"
                >
                  {matchingProfessors.slice(0, 5).map((entry) => (
                    <button
                      key={entry.id}
                      type="button"
                      className="block w-full border-b border-line px-3 py-2 text-left text-sm text-ink last:border-b-0 hover:bg-brand-soft focus:bg-brand-soft"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => selectProfessor(entry)}
                    >
                      {entry.name}
                    </button>
                  ))}
                  {matchingProfessors.length > 5 && (
                    <p className="border-t border-line bg-surface-sunken px-3 py-2 text-xs text-ink-muted">
                      Exibindo 5 de {matchingProfessors.length} professores.
                      Refine a busca.
                    </p>
                  )}
                  {!matchingProfessors.length && (
                    <p className="px-3 py-2 text-sm text-ink-muted">
                      Nenhum professor encontrado.
                    </p>
                  )}
                </div>
              )}
            </div>
            <label className="flex flex-col gap-1 text-xs font-medium text-ink-muted">
              Período letivo
              <select
                className="form-input w-full"
                value={periodId}
                onChange={(event) => setPeriodId(event.currentTarget.value)}
                disabled={!periodos.length}
              >
                <option value="">Selecione...</option>
                {[...periodos]
                  .sort((a, b) => academicKey(b) - academicKey(a))
                  .map((period) => (
                    <option key={period.id} value={period.id}>
                      {periodLabel(period)}
                    </option>
                  ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs font-medium text-ink-muted">
              Grade
              <select
                className="form-input w-full"
                value={gradeId}
                onChange={(event) => setGradeId(event.currentTarget.value)}
                disabled={!gradesForPeriod.length || loadingGrades}
              >
                <option value="">
                  {loadingGrades ? "Carregando..." : "Selecione..."}
                </option>
                {gradesForPeriod.map((grade) => (
                  <option key={grade.id} value={grade.id}>
                    {gradesForPeriod.indexOf(grade) + 1}ª Grade —{" "}
                    {periodLabel(selectedPeriod)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {professor && (
            <dl className="mt-5 grid gap-x-6 gap-y-4 border-t border-line pt-4 sm:grid-cols-2 lg:grid-cols-4">
              <ProfileField label="Professor" value={professor.name} />
              <ProfileField label="Titulação" value={professor.title} />
              <ProfileField label="Situação" value={professor.status} />
              <ProfileField
                label="Período selecionado"
                value={periodLabel(selectedPeriod)}
              />
              <ProfileField
                label="Carga semanal cadastrada"
                value={selectedGrade ? `${selectedGrade.semanal}h` : "—"}
              />
            </dl>
          )}

          {!professor && (
            <p className="mt-4 rounded-control bg-surface-sunken p-3 text-sm text-ink-muted">
              {professorNotFound
                ? "Professor não encontrado. Confira o nome ou cadastre o professor para continuar."
                : "Pesquise e selecione um professor cadastrado para consultar a grade."}
            </p>
          )}
          {professorNotFound && (
            <Link
              className="btn mt-3"
              data-variant="outline"
              to="/professor/add"
            >
              Cadastrar professor
            </Link>
          )}
          {gradesError && (
            <p className="mt-3 text-sm text-danger-fg" role="alert">
              Não foi possível carregar as grades: {gradesError}
            </p>
          )}
          {professor && !loadingGrades && !gradesError && (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-ink-muted">
                {gradesForPeriod.length
                  ? `${gradesForPeriod.length} grade(s) encontrada(s) neste período.`
                  : `Este professor ainda não possui grade em ${periodLabel(selectedPeriod)}.`}
              </p>
              <Link
                className="btn"
                to={`/professor/${professor.id}/grades/new`}
              >
                {gradesForPeriod.length
                  ? "Cadastrar outra grade"
                  : "Cadastrar grade"}
              </Link>
            </div>
          )}
        </section>

        {selectedGrade && (
          <section className="overflow-hidden rounded-card border border-brand/40 bg-surface">
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-brand-soft/40 px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand">
                  Grade em foco
                </p>
                <h2 className="mt-1 font-semibold text-ink">
                  {periodLabel(selectedPeriod)}
                </h2>
                <p className="mt-1 text-sm text-ink-muted">
                  Confira as aulas cadastradas para este professor.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-control border border-line bg-surface px-3 py-2 text-xs text-ink-muted">
                  {gradesForPeriod.findIndex(
                    (grade) => grade.id === selectedGrade.id,
                  ) + 1}
                  ª Grade
                </span>
              </div>
            </header>

            <div className="flex flex-col gap-4 p-5">
              {loadingSchedule && (
                <p className="text-sm text-ink-muted" role="status">
                  Carregando disciplinas e horários...
                </p>
              )}
              {scheduleError && (
                <div
                  className="flex flex-wrap items-center justify-between gap-3 rounded-control border border-danger-dot/30 bg-danger-bg p-3 text-sm text-danger-fg"
                  role="alert"
                >
                  <p>Não foi possível carregar os horários: {scheduleError}</p>
                  <button
                    className="btn"
                    data-variant="outline"
                    type="button"
                    onClick={() => setRetrySchedule((value) => value + 1)}
                  >
                    Tentar novamente
                  </button>
                </div>
              )}
              {!loadingSchedule && !scheduleError && schedule.length > 0 && (
                <div className="flex flex-col gap-4">
                  {shifts.map((shift) => {
                    const shiftDisciplines = schedule.filter(
                      (item) => item.shift === shift,
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
                              {weekdays.map((weekday) => {
                                const lessons = shiftDisciplines
                                  .flatMap((item) =>
                                    item.lessons
                                      .filter(
                                        (lesson) =>
                                          lesson.diaSemana === weekday.value,
                                      )
                                      .map((lesson) => ({ ...lesson, item })),
                                  )
                                  .sort((a, b) =>
                                    a.horaInicio.localeCompare(b.horaInicio),
                                  );
                                return (
                                  <td
                                    key={weekday.value}
                                    className="min-w-28 border border-line p-1 align-top"
                                  >
                                    {lessons.length ? (
                                      <div className="flex flex-col gap-1">
                                        {lessons.map(
                                          ({
                                            id,
                                            horaInicio,
                                            horaFim,
                                            item,
                                          }) => {
                                            const color =
                                              scheduleColors[
                                                schedule.indexOf(item) %
                                                  scheduleColors.length
                                              ];
                                            return (
                                              <div
                                                key={id}
                                                className="rounded border px-1.5 py-1"
                                                style={{
                                                  borderColor: color,
                                                  backgroundColor: `color-mix(in srgb, ${color} 12%, white)`,
                                                  color,
                                                }}
                                                title={`${item.name} — ${item.course} (${formatTurno(item.shift)})`}
                                              >
                                                <strong className="block font-medium">
                                                  {horaInicio.slice(0, 5)}–
                                                  {horaFim.slice(0, 5)}
                                                </strong>
                                                <span className="block truncate">
                                                  {item.name}
                                                </span>
                                              </div>
                                            );
                                          },
                                        )}
                                      </div>
                                    ) : (
                                      <span className="text-ink-muted">—</span>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                  <div className="grid gap-3 sm:grid-cols-2">
                    {schedule.map((item) => (
                      <div
                        key={`${item.name}-${item.course}`}
                        className="rounded-control border border-line p-3"
                      >
                        <p className="font-medium text-ink">{item.course}</p>
                        <p className="mt-1 text-sm text-ink-muted">
                          {formatTurno(item.shift)} · {item.name}
                        </p>
                        <p className="mt-1 text-xs text-ink-muted">
                          {item.lessons
                            .map(
                              (lesson) =>
                                `${displayDay(lesson.diaSemana)} ${lesson.horaInicio.slice(0, 5)}–${lesson.horaFim.slice(0, 5)}`,
                            )
                            .join(" · ") || "Nenhum horário cadastrado"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {!loadingSchedule && !scheduleError && schedule.length === 0 && (
                <p className="text-sm text-ink-muted">
                  Esta grade ainda não possui disciplinas e horários
                  cadastrados.
                </p>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-ink">{value || "—"}</dd>
    </div>
  );
}
