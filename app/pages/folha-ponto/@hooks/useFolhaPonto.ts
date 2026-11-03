import { useState } from "react";
import getErrorMessage from "~/classes/errors/get-error-message";
import useToast from "~/components/toasts/useToast";
import type FolhaPontoPreview from "~/modules/folha-ponto/folha-ponto.class";
import type { FolhaPontoRequest } from "~/modules/folha-ponto/folha-ponto.class";
import FolhaPontoService from "~/modules/folha-ponto/folha-ponto.service";
import { FolhaPontoDownloadedToast } from "~/modules/folha-ponto/folha-ponto.toasts";
import AuthService from "~/modules/user/auth.service";

/** Controla os filtros, a prévia e o download da folha de ponto. */
export default function useFolhaPonto() {
	const toast = useToast();
	const today = new Date();

	const [professorId, setProfessorId] = useState("");
	const [mes, setMes] = useState(String(today.getMonth() + 1));
	const [ano, setAno] = useState(String(today.getFullYear()));
	const [preview, setPreview] = useState<FolhaPontoPreview | null>(null);
	// Requisição usada na prévia: o download sempre usa exatamente ela.
	const [request, setRequest] = useState<FolhaPontoRequest | null>(null);
	const [loadingPreview, setLoadingPreview] = useState(false);
	const [downloading, setDownloading] = useState(false);
	const [error, setError] = useState("");

	/** Qualquer mudança nos filtros invalida a prévia atual. */
	function changeFilter(setter: (value: string) => void) {
		return (value: string) => {
			setter(value);
			setPreview(null);
			setRequest(null);
			setError("");
		};
	}

	async function loadPreview() {
		const year = Number(ano);
		if (!professorId) return setError("Selecione um professor.");
		if (!Number.isInteger(year) || year < 2000 || year > 2050)
			return setError("Informe um ano entre 2000 e 2050.");

		const next: FolhaPontoRequest = {
			professorId: Number(professorId),
			mes: Number(mes),
			ano: year,
		};

		setLoadingPreview(true);
		setError("");
		setPreview(null);
		setRequest(null);
		try {
			setPreview(
				await FolhaPontoService.preview(next, AuthService.getUserToken()),
			);
			setRequest(next);
		} catch (e) {
			setError(
				getErrorMessage(e, "Não foi possível gerar a prévia da folha de ponto."),
			);
		} finally {
			setLoadingPreview(false);
		}
	}

	async function download() {
		if (!request) return;
		setDownloading(true);
		setError("");
		try {
			await FolhaPontoService.download(request, AuthService.getUserToken());
			toast.push(FolhaPontoDownloadedToast);
		} catch (e) {
			setError(getErrorMessage(e, "Não foi possível gerar o documento."));
		} finally {
			setDownloading(false);
		}
	}

	return {
		form: {
			professorId,
			mes,
			ano,
			loadingPreview,
			error,
			onProfessorChange: changeFilter(setProfessorId),
			onMesChange: changeFilter(setMes),
			onAnoChange: changeFilter(setAno),
			onPreview: loadPreview,
		},
		preview: {
			data: preview,
			downloading,
			onDownload: download,
		},
	};
}

export type FolhaPontoFormState = ReturnType<typeof useFolhaPonto>["form"];
export type FolhaPontoPreviewState = ReturnType<typeof useFolhaPonto>["preview"];