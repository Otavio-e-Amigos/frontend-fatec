import { useMemo, useState } from "react";
import { useRevalidator } from "react-router";
import useDialogs from "~/hooks/useDialogs";
import {
	novaAula,
	novaDisciplina,
	toApi,
} from "~/modules/folha-ponto/api/folha-ponto.mapper";
import type {
	AlvoCadastro,
	Sistema,
} from "~/modules/folha-ponto/folha-ponto.cadastro";
import FolhaPontoService from "~/modules/folha-ponto/folha-ponto.service";
import type {
	AulaExtraida,
	DisciplinaExtraida,
	GradeExtraida,
	HorasExtraidas,
	ProfessorExtraido,
} from "~/modules/folha-ponto/folha-ponto.types";
import {
	temErros,
	validarFolha,
} from "~/modules/folha-ponto/folha-ponto.validation";
import AuthService from "~/modules/user/auth.service";

const TAMANHO_MAXIMO = 10 * 1024 * 1024; // mesmo limite do Back

function baixarJson(nome: string, conteudo: unknown) {
	const blob = new Blob([JSON.stringify(conteudo, null, 2)], {
		type: "application/json",
	});
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = nome;
	link.click();
	URL.revokeObjectURL(url);
}

export default function useFolhaPonto(sistema: Sistema) {
	const dialogs = useDialogs();
	const { revalidate } = useRevalidator();

	const [arquivo, setArquivo] = useState<File | null>(null);
	const [dados, setDados] = useState<GradeExtraida | null>(null);
	const [extraindo, setExtraindo] = useState(false);
	const [exportando, setExportando] = useState(false);
	const [erro, setErro] = useState("");
	const [cadastro, setCadastro] = useState<AlvoCadastro | null>(null);

	const erros = useMemo(() => (dados ? validarFolha(dados) : null), [dados]);

	// --- arquivo e extração ---
	function selecionarArquivo(file: File | null) {
		setErro("");
		if (!file) return setArquivo(null);
		const ehPdf =
			file.type === "application/pdf" ||
			file.name.toLowerCase().endsWith(".pdf");
		if (!ehPdf) {
			setArquivo(null);
			return setErro("Formato inválido: envie um arquivo PDF.");
		}
		if (file.size > TAMANHO_MAXIMO) {
			setArquivo(null);
			return setErro("O arquivo excede o tamanho máximo de 10 MB.");
		}
		setArquivo(file);
	}

	async function extrair() {
		if (!arquivo) return;
		setErro("");
		setExtraindo(true);
		try {
			setDados(
				await FolhaPontoService.extrair(arquivo, AuthService.getUserToken()),
			);
		} catch (e) {
			setErro(
				e instanceof Error
					? e.message
					: "Não foi possível extrair os dados do arquivo.",
			);
		} finally {
			setExtraindo(false);
		}
	}

	async function exportar() {
		if (!dados || !erros) return;
		setErro("");
		if (temErros(erros)) {
			dialogs.toast.error("Corrija os campos destacados antes de exportar.");
			return;
		}
		setExportando(true);
		try {
			// o Back valida e normaliza de novo (nunca confia só no front)
			const validado = await FolhaPontoService.validar(
				dados,
				AuthService.getUserToken(),
			);
			setDados(validado);
			const { professor, ano, semestre } = validado;
			baixarJson(
				`folha-ponto_${professor.matricula}_${ano}-${semestre}.json`,
				toApi(validado),
			);
			dialogs.toast.success("Dados exportados com sucesso.");
		} catch (e) {
			setErro(
				e instanceof Error ? e.message : "Não foi possível validar os dados.",
			);
		} finally {
			setExportando(false);
		}
	}

	function limpar() {
		setDados(null);
		setArquivo(null);
		setErro("");
		setCadastro(null);
	}

	// --- cadastro no sistema (diálogo com os formulários reais) ---
	const abrirCadastro = (alvo: AlvoCadastro) => setCadastro(alvo);
	const fecharCadastro = () => setCadastro(null);
	// recarrega as listas do loader: as barras passam a "Já cadastrado"
	const cadastroSalvo = () => {
		setCadastro(null);
		revalidate();
	};

	// --- edição do formulário (imutável) ---
	const atualizar = (patch: Partial<GradeExtraida>) =>
		setDados((d) => d && { ...d, ...patch });
	const atualizarProfessor = (patch: Partial<ProfessorExtraido>) =>
		setDados((d) => d && { ...d, professor: { ...d.professor, ...patch } });
	const atualizarHoras = (patch: Partial<HorasExtraidas>) =>
		setDados((d) => d && { ...d, horas: { ...d.horas, ...patch } });

	const atualizarDisciplina = (i: number, patch: Partial<DisciplinaExtraida>) =>
		setDados(
			(d) =>
				d && {
					...d,
					disciplinas: d.disciplinas.map((x, k) =>
						k === i ? { ...x, ...patch } : x,
					),
				},
		);
	const adicionarDisciplina = () =>
		setDados(
			(d) => d && { ...d, disciplinas: [...d.disciplinas, novaDisciplina()] },
		);
	const removerDisciplina = (i: number) =>
		setDados(
			(d) => d && { ...d, disciplinas: d.disciplinas.filter((_, k) => k !== i) },
		);

	const atualizarAula = (i: number, j: number, patch: Partial<AulaExtraida>) =>
		setDados(
			(d) =>
				d && {
					...d,
					disciplinas: d.disciplinas.map((x, k) =>
						k !== i
							? x
							: {
									...x,
									aulas: x.aulas.map((a, n) =>
										n === j ? { ...a, ...patch } : a,
									),
								},
					),
				},
		);
	const adicionarAula = (i: number) =>
		setDados(
			(d) =>
				d && {
					...d,
					disciplinas: d.disciplinas.map((x, k) =>
						k === i ? { ...x, aulas: [...x.aulas, novaAula()] } : x,
					),
				},
		);
	const removerAula = (i: number, j: number) =>
		setDados(
			(d) =>
				d && {
					...d,
					disciplinas: d.disciplinas.map((x, k) =>
						k === i ? { ...x, aulas: x.aulas.filter((_, n) => n !== j) } : x,
					),
				},
		);

	return {
		// estado
		arquivo,
		dados,
		erros,
		erro,
		extraindo,
		exportando,
		sistema,
		cadastro,
		// arquivo, extração e exportação
		selecionarArquivo,
		extrair,
		exportar,
		limpar,
		// cadastro no sistema
		abrirCadastro,
		fecharCadastro,
		cadastroSalvo,
		// edição do formulário
		atualizar,
		atualizarProfessor,
		atualizarHoras,
		atualizarDisciplina,
		adicionarDisciplina,
		removerDisciplina,
		atualizarAula,
		adicionarAula,
		removerAula,
	};
}

export type FolhaPontoState = ReturnType<typeof useFolhaPonto>;