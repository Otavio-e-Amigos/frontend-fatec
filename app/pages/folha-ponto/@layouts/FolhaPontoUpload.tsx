import GenericFloor from "~/layouts/pages/GenericFloor";
import type { FolhaPontoState } from "../@hooks/useFolhaPonto";
import { CardHeader } from "./Field";

export default function FolhaPontoUpload({ state }: { state: FolhaPontoState }) {
	const { arquivo, dados, erro, extraindo, selecionarArquivo, extrair, limpar } = state;

	return (
		<GenericFloor
			header={
				<CardHeader
					title="Folha de Ponto"
					description="Envie a grade horária em PDF. Os dados extraídos aparecem em um formulário para conferência e correção."
				/>
			}
			className="flex flex-col gap-3 p-5"
		>
			<input
				type="file"
				accept="application/pdf"
				className="form-input h-auto py-1.5"
				disabled={extraindo}
				onChange={(e) => selecionarArquivo(e.target.files?.[0] ?? null)}
			/>

			{erro && (
				<p role="alert" className="text-sm text-hint-alert-dot">
					{erro}
				</p>
			)}

			<div className="flex gap-2">
				<button
					type="button"
					className="btn"
					disabled={!arquivo || extraindo}
					onClick={extrair}
				>
					{extraindo ? "Extraindo dados..." : "Extrair dados"}
				</button>
				{dados && (
					<button type="button" className="btn" data-variant="secondary" onClick={limpar}>
						Nova importação
					</button>
				)}
			</div>
			{extraindo && (
				<p className="text-xs text-ink-muted">Isso pode levar alguns segundos.</p>
			)}
		</GenericFloor>
	);
}