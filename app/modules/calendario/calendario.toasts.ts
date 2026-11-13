import type { ToastObject } from "~/components/toasts/useToast";

export const EventoCalendarioSavedToast: ToastObject = {
	tone: "success",
	message: "Evento adicionado ao calendário.",
};

export const EventoCalendarioUpdatedToast: ToastObject = {
	tone: "success",
	message: "Evento atualizado com sucesso.",
};

export const EventoCalendarioDeletedToast: ToastObject = {
	tone: "success",
	message: "Evento removido do calendário.",
};

export const EventoCalendarioGenericSaveFailedToast: ToastObject = {
	tone: "error",
	message: "Não foi possível salvar o evento.",
};
