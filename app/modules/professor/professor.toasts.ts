import type { ToastObject } from "~/components/toasts/useToast";

export const ProfessorUpdatedToast: ToastObject = {
	tone: "success",
	message: "Professor atualizado com sucesso.",
};

export const ProfessorSavedToast: ToastObject = {
	tone: "success",
	message: "Professor cadastrado com sucesso.",
};

export const ProfessorGenericSaveFailedToast: ToastObject = {
	tone: "error",
	message: "Não foi possível salvar o professor.",
};
