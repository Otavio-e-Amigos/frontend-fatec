import type { ToastObject } from "~/components/toasts/useToast";

export const UserUpdatedToast: ToastObject = {
	tone: "success",
	message: "Usuário atualizada com sucesso.",
};

export const UserSavedToast: ToastObject = {
	tone: "success",
	message: "Usuário cadastrada com sucesso.",
};

export const UserGenericSaveFailedToast: ToastObject = {
	tone: "error",
	message: "Não foi possível salvar a Usuário.",
};
