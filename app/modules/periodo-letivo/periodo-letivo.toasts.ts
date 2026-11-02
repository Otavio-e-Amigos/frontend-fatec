import type { ToastObject } from "~/components/toasts/useToast";

export const PeriodoLetivoUpdatedToast: ToastObject = {
	tone: "success",
	message: "Periodo Letivo atualizado com sucesso.",
};

export const PeriodoLetivoSavedToast: ToastObject = {
	tone: "success",
	message: "Periodo Letivo cadastrado com sucesso.",
};

export const PeriodoLetivoGenericSaveFailedToast: ToastObject = {
	tone: "error",
	message: "Não foi possível salvar o período letivo.",
};
