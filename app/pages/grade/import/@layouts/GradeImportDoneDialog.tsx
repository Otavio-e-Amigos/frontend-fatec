import { Link } from "react-router";
import type { ImportedGradeResult } from "~/modules/grade/extraction/grade-extraction.types";

/** Result window with the two next steps after saving. */
export default function GradeImportDoneDialog({ result }: { result: ImportedGradeResult }) {
	const params = new URLSearchParams({ professor: String(result.professorId), preview: "1" });
	if (result.month) params.set("mes", String(result.month));
	if (result.year) params.set("ano", String(result.year));

	return (
		<div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/50 p-4">
			<section
				role="dialog"
				aria-modal="true"
				aria-labelledby="grade-import-done-title"
				className="surface my-auto w-full max-w-xl rounded-card p-6 shadow-card"
			>
				<header className="mb-5 border-b border-line pb-3">
					<h2 id="grade-import-done-title" className="text-xl font-semibold text-brand">
						Grade salva com sucesso
					</h2>
					<p className="mt-1 text-sm text-ink-muted">O que você quer fazer agora?</p>
				</header>

				<ul className="list-disc pl-5 text-sm text-ink-muted">
					{result.summary.map((line, i) => (
						<li key={i}>{line}</li>
					))}
				</ul>

				<footer className="mt-6 flex flex-wrap justify-end gap-2">
					<Link className="btn" data-variant="outline" to={`/professor/${result.professorId}`}>
						Ir para a página do docente
					</Link>
					<Link className="btn" to={`/folha-ponto?${params.toString()}`}>
						Gerar folha de ponto
					</Link>
				</footer>
			</section>
		</div>
	);
}