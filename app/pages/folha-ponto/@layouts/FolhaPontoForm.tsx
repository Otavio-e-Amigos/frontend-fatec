import type Professor from "~/modules/professor/professor.class";
import GenericFloor from "~/layouts/pages/GenericFloor";
import type { FolhaPontoFormState } from "../@hooks/useFolhaPonto";
import { MESES } from "../folha-ponto-page.utils";

type FolhaPontoFormProps = FolhaPontoFormState & { professores: Professor[] };

/** Filtros da folha: professor, mês e ano. */
export default function FolhaPontoForm({
	professores,
	professorId,
	mes,
	ano,
	loadingPreview,
	error,
	onProfessorChange,
	onMesChange,
	onAnoChange,
	onPreview,
}: FolhaPontoFormProps) {
	return (
		<GenericFloor className="p-5">
			<h2 className="font-semibold text-ink">Dados da folha</h2>
			<p className="mt-1 text-sm text-ink-muted">
				A grade do semestre correspondente ao mês é usada automaticamente.
			</p>

			<div className="mt-4 grid gap-3 md:grid-cols-4">
				<label className="flex flex-col gap-1 text-xs font-medium text-ink-muted md:col-span-2">
					Professor
					<select
						className="form-input w-full"
						value={professorId}
						onChange={(event) => onProfessorChange(event.currentTarget.value)}
					>
						<option value="">Selecione...</option>
						{professores.map((professor) => (
							<option key={professor.id} value={professor.id}>
								{professor.name}
							</option>
						))}
					</select>
				</label>

				<label className="flex flex-col gap-1 text-xs font-medium text-ink-muted">
					Mês
					<select
						className="form-input w-full"
						value={mes}
						onChange={(event) => onMesChange(event.currentTarget.value)}
					>
						{MESES.map((nome, index) => (
							<option key={nome} value={index + 1}>
								{nome}
							</option>
						))}
					</select>
				</label>

				<label className="flex flex-col gap-1 text-xs font-medium text-ink-muted">
					Ano
					<input
						className="form-input w-full"
						type="number"
						min={2000}
						max={2050}
						value={ano}
						onChange={(event) => onAnoChange(event.currentTarget.value)}
					/>
				</label>
			</div>

			{error && (
				<p className="mt-3 text-sm text-danger-fg" role="alert">
					{error}
				</p>
			)}

			<div className="mt-4 flex justify-end">
				<button
					type="button"
					className="btn"
					disabled={loadingPreview}
					onClick={onPreview}
				>
					{loadingPreview ? "Gerando prévia..." : "Visualizar prévia"}
				</button>
			</div>
		</GenericFloor>
	);
}