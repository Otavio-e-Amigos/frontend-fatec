import { useEffect, useState } from "react";
import getErrorMessage from "~/classes/errors/get-error-message";
import useToast from "~/components/toasts/useToast";
import ProfessorService from "~/modules/professor/professor.service";
import type Professor from "~/modules/professor/professor.class";
import RelatorioService from "~/modules/relatorio/relatorio.service";
import type {
	FormatoRelatorio,
	RelatorioExtracaoGrade,
	RelatorioFiltro,
	RelatorioFolhaPonto,
	TipoPeriodo,
	TipoRelatorio,
} from "~/modules/relatorio/relatorio.types";
import AuthService from "~/modules/user/auth.service";
import { hojeISO } from "../relatorio-page.utils";

export type RelatorioInitial = {
	periodo?: TipoPeriodo;
	data?: string;
	professorId?: string;
};

type Resultado = RelatorioExtracaoGrade | RelatorioFolhaPonto;

/** Controla filtros, geração e exportação de um relatório (a janela só desenha). */
export default function useRelatorio(
	tipo: TipoRelatorio,
	initial: RelatorioInitial = {},
) {
	const toast = useToast();

	const [periodo, setPeriodo] = useState<TipoPeriodo>(initial.periodo ?? "MENSAL");
	const [data, setData] = useState(initial.data ?? hojeISO());
	const [professorId, setProfessorId] = useState(initial.professorId ?? "");
	const [professores, setProfessores] = useState<Professor[]>([]);

	const [resultado, setResultado] = useState<Resultado | null>(null);
	// Filtros usados na geração: a exportação sempre usa exatamente eles.
	const [request, setRequest] = useState<RelatorioFiltro | null>(null);
	const [loading, setLoading] = useState(false);
	const [exporting, setExporting] = useState<FormatoRelatorio | null>(null);
	const [error, setError] = useState("");

	/** Qualquer mudança nos filtros invalida o resultado atual. */
	function changeFilter<T>(setter: (value: T) => void) {
		return (value: T) => {
			setter(value);
			setResultado(null);
			setRequest(null);
			setError("");
		};
	}

	async function gerar() {
		if (!data) return setError("Informe a data.");
		if (data > hojeISO()) return setError("A data não pode ser futura.");

		const next: RelatorioFiltro = {
			periodo,
			data,
			professorId:
				tipo === "FOLHA_PONTO" && professorId ? Number(professorId) : undefined,
		};

		setLoading(true);
		setError("");
		setResultado(null);
		setRequest(null);

		try {
			const auth = AuthService.getUserToken();
			setResultado(
				tipo === "EXTRACAO_GRADE"
					? await RelatorioService.extracaoGrades(next, auth)
					: await RelatorioService.folhasPonto(next, auth),
			);
			setRequest(next);
		} catch (e) {
			setError(getErrorMessage(e, "Não foi possível gerar o relatório."));
		} finally {
			setLoading(false);
		}
	}

	async function exportar(formato: FormatoRelatorio) {
		if (!request) return;

		setExporting(formato);
		setError("");
		try {
			await RelatorioService.exportar(tipo, request, formato, AuthService.getUserToken());
			toast.push({ tone: "success", message: `Relatório exportado em ${formato}.` });
		} catch (e) {
			setError(getErrorMessage(e, "Não foi possível exportar o relatório."));
		} finally {
			setExporting(null);
		}
	}

	useEffect(() => {
		// Abre já com o relatório gerado: quem abre a janela quer ver os números.
		gerar();

		if (tipo === "FOLHA_PONTO") {
			ProfessorService.get(AuthService.getUserToken())
				.then((list) =>
					setProfessores(
						[...list].sort((a, b) => (a.name ?? "").localeCompare(b.name ?? "", "pt-BR")),
					),
				)
				.catch(() => setProfessores([]));
		}
	}, []);

	return {
		filtros: {
			tipo,
			periodo,
			data,
			professorId,
			professores,
			loading,
			onPeriodoChange: changeFilter<TipoPeriodo>(setPeriodo),
			onDataChange: changeFilter<string>(setData),
			onProfessorChange: changeFilter<string>(setProfessorId),
			onGerar: gerar,
		},
		resultado,
		loading,
		exporting,
		error,
		onExportar: exportar,
	};
}

export type RelatorioFiltrosState = ReturnType<typeof useRelatorio>["filtros"];
