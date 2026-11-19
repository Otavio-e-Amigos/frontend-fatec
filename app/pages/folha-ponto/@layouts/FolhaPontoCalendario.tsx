import { useEffect, useRef, useState } from "react";
import getErrorMessage from "~/classes/errors/get-error-message";
import useToast from "~/components/toasts/useToast";
import type EventoCalendario from "~/modules/calendario/calendario.class";
import {
	FERIADOS_FIXOS,
	TIPOS_EVENTO,
} from "~/modules/calendario/calendario.class";
import {
	exportCalendarioJson,
	parseCalendarioJson,
} from "~/modules/calendario/calendario.json";
import CalendarioService from "~/modules/calendario/calendario.service";
import {
	EventoCalendarioDeletedToast,
	EventoCalendarioGenericSaveFailedToast,
	EventoCalendarioSavedToast,
	EventoCalendarioUpdatedToast,
} from "~/modules/calendario/calendario.toasts";
import formatDate from "~/modules/periodo-letivo/format-date";
import AuthService from "~/modules/user/auth.service";
import { MESES } from "../folha-ponto-page.utils";
import CalendarioConfirmacaoAnual from "./CalendarioConfirmacaoAnual";
import useWindow from "~/components/windows/useWindow";
import ShadowCenter from "~/layouts/containers/ShadowCenter";
import GenericFloor from "~/layouts/pages/GenericFloor";
import FloorHeader from "~/layouts/pages/FloorHeader";

type FolhaPontoCalendarioProps = {
	/** Ano do filtro da folha: o calendário abre nele. */
	ano: string;
	onChanged: () => void | Promise<void>;
};

const WEEK = ["D", "S", "T", "Q", "Q", "S", "S"];
const pad = (value: number) => String(value).padStart(2, "0");
const isoOf = (year: number, month: number, day: number) =>
	`${year}-${pad(month + 1)}-${pad(day)}`;

type MiniMonthProps = {
	year: number;
	month: number; // 0 a 11
	byDate: Map<string, EventoCalendario>;
	selected: string | null;
	onSelect: (iso: string) => void;
};

/** Um mês compacto: dias clicáveis, coloridos conforme o evento ou feriado fixo. */
function MiniMonth({ year, month, byDate, selected, onSelect }: MiniMonthProps) {
	const offset = new Date(year, month, 1).getDay(); // 0 = domingo
	const total = new Date(year, month + 1, 0).getDate();

	return (
		<div className="rounded-control border border-page-floor-outline bg-page-floor-accent/20 p-2">
			<p className="mb-1 text-xs font-semibold text-text">{MESES[month]}</p>
			<div className="grid grid-cols-7 gap-px text-center text-[10px]">
				{WEEK.map((name, index) => (
					<span key={index} className="text-text-muted">
						{name}
					</span>
				))}

				{Array.from({ length: offset }, (_, index) => (
					<span key={`blank-${index}`} />
				))}

				{Array.from({ length: total }, (_, index) => {
					const day = index + 1;
					const iso = isoOf(year, month, day);
					const event = byDate.get(iso);
					const fixed = event ? undefined : FERIADOS_FIXOS[`${pad(month + 1)}-${pad(day)}`];
					const isSunday = (offset + index) % 7 === 0;
					const label = event?.descricao ?? fixed;

					const tone =
						(event ? event.semAula : Boolean(fixed))
							? "bg-brand-soft font-semibold text-text"
							: event
								? "border border-brand text-text"
								: isSunday
									? "text-text-muted"
									: "text-text hover:bg-surface-sunken";

					return (
						<button
							key={day}
							type="button"
							title={label ?? undefined}
							className={`h-6 rounded ${tone}${selected === iso ? " ring-2 ring-brand" : ""}`}
							onClick={() => onSelect(iso)}
						>
							{day}
						</button>
					);
				})}
			</div>
		</div>
	);
}

/** Calendário acadêmico do ano: clique em um dia para atribuir, alterar ou remover um evento. */
export default function FolhaPontoCalendario({
	ano,
	onChanged,
}: FolhaPontoCalendarioProps) {
	const toast = useToast();
	const fileInput = useRef<HTMLInputElement>(null);

	const calendarWindow = useWindow();
	const [year, setYear] = useState(() => Number(ano) || new Date().getFullYear());
	const [events, setEvents] = useState<EventoCalendario[]>([]);
	const [selected, setSelected] = useState<string | null>(null);
	const [descricao, setDescricao] = useState("");
	const [tipo, setTipo] = useState("FERIADO");
	const [semAula, setSemAula] = useState("true");
	const [confirmRemoval, setConfirmRemoval] = useState(false);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState("");
	const [info, setInfo] = useState("");

	const byDate = new Map(events.map((event) => [event.data ?? "", event]));
	const existing = selected ? byDate.get(selected) : undefined;
	const fixedReason =
		selected && !existing ? FERIADOS_FIXOS[selected.slice(5)] : undefined;

	// a janela já abre carregando os eventos
	useEffect(() => {
		load();
	}, []);

	// o ano do filtro mudou: o calendário acompanha
	useEffect(() => {
		const next = Number(ano);
		if (Number.isInteger(next) && next >= 2000 && next <= 2050) setYear(next);
	}, [ano]);
	async function load() {
		try {
			setEvents(await CalendarioService.get(AuthService.getUserToken()));
		} catch (e) {
			setError(getErrorMessage(e, "Não foi possível carregar o calendário."));
		}
	}

	function select(iso: string) {
		const event = byDate.get(iso);
		setSelected(iso);
		setDescricao(event?.descricao ?? "");
		setTipo(event?.tipo ?? "FERIADO");
		setSemAula(event ? String(event.semAula) : "true");
		setConfirmRemoval(false);
		setError("");
		setInfo("");
	}

	/** Executa a ação, recarrega o calendário e a prévia (os avisos da folha mudam junto). */
	async function run(action: () => Promise<void>, fallback: string) {
		setBusy(true);
		setError("");
		try {
			await action();
			await load();
			await onChanged();
			setSelected(null);
		} catch (e) {
			setError(getErrorMessage(e, fallback));
		} finally {
			setBusy(false);
		}
	}

	function save() {
		if (!selected) return;
		if (!descricao.trim()) return setError("Informe a descrição do evento.");

		const isEdit = Boolean(existing);
		return run(async () => {
			await CalendarioService.save(
				{ data: selected, descricao, tipo, semAula: semAula === "true" },
				AuthService.getUserToken(),
				isEdit,
			);
			toast.push(isEdit ? EventoCalendarioUpdatedToast : EventoCalendarioSavedToast);
		}, EventoCalendarioGenericSaveFailedToast.message);
	}

	function remove() {
		if (!selected) return;

		return run(async () => {
			const deleted = await CalendarioService.delete(selected, AuthService.getUserToken());
			if (!deleted) {
				throw new Error("Não foi possível remover o evento. Tente novamente.");
			}
			toast.push(EventoCalendarioDeletedToast);
		}, "Não foi possível remover o evento.");
	}

	function exportJson() {
		const blob = new Blob([exportCalendarioJson(events)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "calendario-academico.json";
		link.click();
		URL.revokeObjectURL(url);
		setInfo(`${events.length} evento(s) exportado(s).`);
	}

	/** Valida o arquivo inteiro antes de enviar; depois cria ou atualiza cada evento. */
	async function importJson(file: File | null) {
		if (!file) return;
		setError("");
		setInfo("");

		const { events: items, errors } = parseCalendarioJson(await file.text());
		if (errors.length > 0) {
			const more = errors.length > 4 ? ` (+${errors.length - 4})` : "";
			return setError(`Arquivo inválido: ${errors.slice(0, 4).join(" · ")}${more}`);
		}
		if (items.length === 0) return setError("O arquivo não tem eventos.");

		setBusy(true);
		const existingDates = new Set(events.map((event) => event.data));
		let created = 0;
		let updated = 0;
		const failed: string[] = [];

		for (const item of items) {
			const isEdit = existingDates.has(item.data);
			try {
				await CalendarioService.save(item, AuthService.getUserToken(), isEdit);
				if (isEdit) updated++;
				else created++;
			} catch (e) {
				failed.push(`${formatDate(item.data)}: ${getErrorMessage(e, "erro ao salvar")}`);
			}
		}

		await load();
		await onChanged();
		setBusy(false);
		setSelected(null);

		const problems = failed.length ? `, ${failed.length} com erro (${failed.slice(0, 3).join(" · ")})` : "";
		setInfo(`Importação concluída: ${created} novo(s), ${updated} atualizado(s)${problems}.`);
	}

	return (
		<ShadowCenter onClick={() => calendarWindow.hide()}>
			<GenericFloor
				// role="dialog"
				aria-label="Calendário acadêmico"
				className="flex max-h-[90vh] w-full max-w-5xl flex-col gap-3 overflow-y-auto rounded-card p-5 shadow-card"
				wrapperClassName="max-h-[90vh] w-full max-w-5xl"
				// onClick={(event) => event.stopPropagation()}
				header={<div className="flex flex-row items-center justify-between mx-4 my-3">
					<FloorHeader title={"Calendário Acadêmico"} />
					<button
						type="button"
						className="btn"
						data-variant="outline"
						data-size="sm"
						onClick={() => calendarWindow.hide()}
					>
						Fechar
					</button>
				</div>}
			>
				{/*<header className="flex items-center justify-between gap-3">*/}
					{/*<h2 className="text-xl font-semibold text-text">Calendário acadêmico</h2>*/}
				{/*</header>*/}

				<div className="flex flex-wrap items-center justify-between gap-2">
					<div className="flex items-center gap-2">
						<button type="button" className="btn" data-variant="outline" data-size="sm"
							onClick={() => setYear((current) => current - 1)}>
							‹
						</button>
						<span className="min-w-12 text-center text-sm font-semibold text-text">{year}</span>
						<button type="button" className="btn" data-variant="outline" data-size="sm"
							onClick={() => setYear((current) => current + 1)}>
							›
						</button>
					</div>

					<div className="flex gap-2">
						<button type="button" className="btn" data-variant="outline" data-size="sm"
							disabled={busy || events.length === 0} onClick={exportJson}>
							Exportar JSON
						</button>
						<button type="button" className="btn" data-variant="outline" data-size="sm"
							disabled={busy} onClick={() => fileInput.current?.click()}>
							Importar JSON
						</button>
						<input
							ref={fileInput}
							type="file"
							accept="application/json,.json"
							className="hidden"
							onChange={(event) => {
								const file = event.currentTarget.files?.[0] ?? null;
								event.currentTarget.value = "";
								importJson(file);
							}}
						/>
					</div>
				</div>

				<CalendarioConfirmacaoAnual year={year} eventsCount={events.length} />

				<CalendarioConfirmacaoAnual year={year} eventsCount={events.length} />

				<p className="text-[11px] text-text-muted">
					Clique em um dia para atribuir um feriado. Em rosa: dia sem aula (feriado fixo ou
					evento). Contorno: evento que mantém as aulas.
				</p>

				{selected && (
					<div className="flex flex-col gap-2 rounded-control bg-page-floor-accent/50 p-3">
						<p className="text-xs font-medium text-text">
							{formatDate(selected)} ({existing ? "editar evento" : "novo evento"})
						</p>

						{fixedReason && (
							<p className="text-[11px] text-text-muted">
								Feriado fixo: {fixedReason}. Para reabri-lo como dia letivo, salve com
								"Suspende as aulas?" = Não.
							</p>
						)}

						<div className="grid gap-2 sm:grid-cols-4">
							<label className="flex flex-col gap-1 text-[11px] font-medium text-text-muted sm:col-span-2">
								Descrição
								<input className="form-input w-full" value={descricao}
									onChange={(event) => setDescricao(event.currentTarget.value)} />
							</label>

							<label className="flex flex-col gap-1 text-[11px] font-medium text-text-muted">
								Tipo
								<select className="form-input w-full" value={tipo}
									onChange={(event) => setTipo(event.currentTarget.value)}>
									{Object.entries(TIPOS_EVENTO).map(([label, value]) => (
										<option key={value} value={value}>{label}</option>
									))}
								</select>
							</label>

							<label className="flex flex-col gap-1 text-[11px] font-medium text-text-muted">
								Suspende as aulas?
								<select className="form-input w-full" value={semAula}
									onChange={(event) => setSemAula(event.currentTarget.value)}>
									<option value="true">Sim</option>
									<option value="false">Não</option>
								</select>
							</label>
						</div>

						<div className="flex flex-wrap items-center gap-2">
							<button type="button" className="btn" data-size="sm" disabled={busy} onClick={save}>
								{busy ? "Salvando..." : existing ? "Salvar alterações" : "Salvar evento"}
							</button>

							{existing && !confirmRemoval && (
								<button type="button" className="btn" data-variant="outline" data-size="sm"
									disabled={busy} onClick={() => setConfirmRemoval(true)}>
									Remover
								</button>
							)}

							{existing && confirmRemoval && (
								<>
									<span className="text-[11px] text-text-muted">
										Remover? Se for um feriado fixo, volta ao padrão do sistema.
									</span>
									<button type="button" className="btn" data-variant="outline" data-size="sm"
										disabled={busy} onClick={remove}>
										Confirmar remoção
									</button>
								</>
							)}

							<button type="button" className="btn" data-variant="outline" data-size="sm"
								disabled={busy} onClick={() => setSelected(null)}>
								Cancelar
							</button>
						</div>
					</div>
				)}

				{error && (
					<p className="text-xs text-hint-alert-fg" role="alert">{error}</p>
				)}
				{info && <p className="text-xs text-text-muted">{info}</p>}

				<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
					{Array.from({ length: 12 }, (_, month) => (
						<MiniMonth key={month} year={year} month={month} byDate={byDate}
							selected={selected} onSelect={select} />
					))}
				</div>
			</GenericFloor>
		</ShadowCenter>
	);
}
