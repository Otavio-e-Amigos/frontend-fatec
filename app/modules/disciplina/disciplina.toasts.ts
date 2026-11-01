import type { ToastObject } from "~/components/toasts/useToast";

export const DisciplinaUpdatedToast: ToastObject = {
	tone: "success",
	message: "Disciplina atualizada com sucesso.",
};

export const DisciplinaSavedToast: ToastObject = {
	tone: "success",
	message: "Disciplina cadastrada com sucesso.",
};

export const DisciplinaGenericSaveFailedToast: ToastObject = {
	tone: "error",
	message: "Não foi possível salvar a disciplina.",
};
