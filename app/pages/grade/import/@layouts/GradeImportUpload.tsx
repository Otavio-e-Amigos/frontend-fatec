import GenericFloor from "~/layouts/pages/GenericFloor";
import type { GradeImportState } from "../@hooks/useGradeImport";
import FloorHeader from "~/layouts/pages/FloorHeader";

/** PDF selection and extraction trigger. */
export default function GradeImportUpload({ state }: { state: GradeImportState }) {
	const { file, data, error, isExtracting, selectFile, extract, reset } = state;

	return (
		<GenericFloor className="flex flex-col gap-3 p-4 shadow-card"
			header={<div className="mx-4 my-3">
				<FloorHeader
					title={"Arquivo da grade"}
					description={"Os dados extraídos aparecem em formulários para conferência antes de salvar."}
				/>
			</div>}
		>
			{/*<header>
				<h2 className="text-xl font-semibold text-brand">Arquivo da grade</h2>
				<p className="text-sm text-ink-muted">
					Os dados extraídos aparecem em formulários para conferência antes de salvar.
				</p>
			</header>*/}
			<input
				type="file"
				accept="application/pdf"
				className="form-input h-auto py-1.5"
				disabled={isExtracting}
				onChange={(event) => selectFile(event.currentTarget.files?.[0] ?? null)}
			/>
			{!data && error && (
				<p className="text-sm text-danger-fg" role="alert">
					{error}
				</p>
			)}
			<div className="flex gap-2">
				<button type="button" className="btn" disabled={!file || isExtracting} onClick={extract}>
					{isExtracting ? "Extraindo dados..." : "Extrair dados"}
				</button>
				{data && (
					<button type="button" className="btn" data-variant="outline" onClick={reset}>
						Nova importação
					</button>
				)}
			</div>
			{isExtracting && (
				<p className="text-xs text-ink-muted">Isso pode levar alguns segundos.</p>
			)}
		</GenericFloor>
	);
}
