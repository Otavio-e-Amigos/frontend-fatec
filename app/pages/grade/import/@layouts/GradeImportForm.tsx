import type { ReactNode } from "react";
import { findPeriod, findProfessor } from "~/modules/grade/extraction/grade-extraction.registry";
import { CONTRACT_OPTIONS, TITLE_OPTIONS } from "~/modules/grade/extraction/grade-extraction.types";
import type { GradeImportState } from "../@hooks/useGradeImport";
import GradeImportDisciplineCard from "./GradeImportDisciplineCard";
import { Field, NumberInput, Pill, SelectInput, TextInput } from "./GradeImportFields";

const grid = "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4";

function Block({ title, status, children }: { title: string; status?: ReactNode; children: ReactNode }) {
	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center gap-2">
				<h3 className="text-sm font-semibold uppercase tracking-wide text-brand">{title}</h3>
				{status}
			</div>
			{children}
		</div>
	);
}

function formatCpf(digits: string) {
	return digits
		.replace(/^(\d{3})(\d)/, "$1.$2")
		.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
		.replace(/\.(\d{3})(\d)/, ".$1-$2");
}

/** Review forms for the extracted data. Complementary fields only show for what is not registered yet. */
export default function GradeImportForm({ state }: { state: GradeImportState }) {
	const { data, errors, extras, registry } = state;
	if (!data || !errors) return null;

	const e = errors.fields;
	const professorExists = !!findProfessor(registry, data.professor);
	const periodExists = !!findPeriod(registry, data);

	return (
		<section className="surface flex flex-col gap-6 rounded-card p-5 shadow-card">
			<header>
				<h2 className="text-xl font-semibold text-brand">Revisão dos dados</h2>
				<p className="text-sm text-ink-muted">
					Confira e corrija os dados extraídos. Campos em vermelho precisam de ajuste.
				</p>
			</header>

			{(data.avisos.length > 0 || errors.general.length > 0) && (
				<ul className="list-disc rounded-lg border border-line p-3 pl-8 text-sm text-danger-fg" role="alert">
					{[...data.avisos, ...errors.general].map((message, i) => (
						<li key={i}>{message}</li>
					))}
				</ul>
			)}

			<Block title="Período letivo" status={<Pill registered={periodExists} />}>
				<div className={grid}>
					<Field label="Semestre" required error={e["semestre"]}>
						<NumberInput value={data.semestre} min={1} error={e["semestre"]}
							onChange={(value) => state.update({ semestre: value })} />
					</Field>
					<Field label="Ano" required error={e["ano"]}>
						<NumberInput value={data.ano} min={2000} error={e["ano"]}
							onChange={(value) => state.update({ ano: value })} />
					</Field>
					<Field label="Validade da grade (início)" required error={e["validadeInicio"]}>
						<TextInput type="date" value={data.validadeInicio} error={e["validadeInicio"]}
							onChange={(value) => state.update({ validadeInicio: value })} />
					</Field>
					<Field label="Validade da grade (fim)" required error={e["validadeFim"]}>
						<TextInput type="date" value={data.validadeFim} error={e["validadeFim"]}
							onChange={(value) => state.update({ validadeFim: value })} />
					</Field>
					{!periodExists && (
						<>
							<Field label="Início do período letivo" required error={e["extras.periodStart"]}>
								<TextInput type="date" value={extras.periodStart} error={e["extras.periodStart"]}
									onChange={(value) => state.updateExtras({ periodStart: value })} />
							</Field>
							<Field label="Fim do período letivo" required error={e["extras.periodEnd"]}>
								<TextInput type="date" value={extras.periodEnd} error={e["extras.periodEnd"]}
									onChange={(value) => state.updateExtras({ periodEnd: value })} />
							</Field>
						</>
					)}
				</div>
				{!periodExists && (
					<p className="text-xs text-ink-muted">
						A grade traz só a validade dela, não as datas do período letivo. Informe-as para cadastrar o período.
					</p>
				)}
			</Block>

			<Block title="Docente" status={<Pill registered={professorExists} />}>
				<div className={grid}>
					<Field label="Nome" required error={e["professor.nome"]}>
						<TextInput value={data.professor.nome} error={e["professor.nome"]}
							onChange={(value) => state.updateProfessor({ nome: value })} />
					</Field>
					<Field label="Matrícula" required error={e["professor.matricula"]}>
						<TextInput value={data.professor.matricula} maxLength={10} error={e["professor.matricula"]}
							onChange={(value) => state.updateProfessor({ matricula: value })} />
					</Field>
					<Field label="CPF" required error={e["professor.cpf"]}>
						<TextInput value={formatCpf(data.professor.cpf)} maxLength={14} error={e["professor.cpf"]}
							onChange={(value) => state.updateProfessor({ cpf: value.replace(/\D/g, "").slice(0, 11) })} />
					</Field>
					<Field label="Contrato" required error={e["professor.contrato"]}>
						<SelectInput value={data.professor.contrato} options={CONTRACT_OPTIONS} error={e["professor.contrato"]}
							onChange={(value) => state.updateProfessor({ contrato: value })} />
					</Field>
					{!professorExists && (
						<>
							<Field label="Titulação" required error={e["extras.professorTitle"]}>
								<SelectInput value={extras.professorTitle} options={TITLE_OPTIONS} error={e["extras.professorTitle"]}
									onChange={(value) => state.updateExtras({ professorTitle: value })} />
							</Field>
							<Field label="Código">
								<TextInput value={extras.professorCode}
									onChange={(value) => state.updateExtras({ professorCode: value })} />
							</Field>
						</>
					)}
				</div>
			</Block>

			<Block title="Carga horária">
				<div className={grid}>
					<Field label="Semanal (aula)">
						<NumberInput step={0.5} value={data.horas.semanalAula}
							onChange={(value) => state.updateHours({ semanalAula: value })} />
					</Field>
					<Field label="Mensal (aula)">
						<NumberInput step={0.5} value={data.horas.mensalAula}
							onChange={(value) => state.updateHours({ mensalAula: value })} />
					</Field>
					<Field label="Mensal (atividade 50%)">
						<NumberInput step={0.5} value={data.horas.mensalAtividade}
							onChange={(value) => state.updateHours({ mensalAtividade: value })} />
					</Field>
					<Field label="Total da grade (mensal)">
						<NumberInput step={0.5} value={data.horas.totalMensal}
							onChange={(value) => state.updateHours({ totalMensal: value })} />
					</Field>
				</div>
			</Block>

			<Block title="Disciplinas e horários">
				{data.disciplinas.map((_, index) => (
					<GradeImportDisciplineCard key={index} state={state} index={index} />
				))}
				<div>
					<button type="button" className="btn" data-variant="outline" onClick={state.addDiscipline}>
						Adicionar disciplina
					</button>
				</div>
			</Block>
		</section>
	);
}