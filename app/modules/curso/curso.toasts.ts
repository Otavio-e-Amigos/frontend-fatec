import type { ToastObject } from "~/components/toasts/useToast";

export const CursoUpdatedToast: ToastObject = {
	tone: "success",
	message: "Curso atualizado com sucesso.",
};

export const CursoSavedToast: ToastObject = {
	tone: "success",
	message: "Curso cadastrado com sucesso.",
};

export const CursoGenericSaveFailedToast: ToastObject = {
	tone: "error",
	message: "Não foi possível salvar o curso.",
};
