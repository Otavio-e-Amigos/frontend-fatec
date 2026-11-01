import { createContext, useContext } from "react";

export type ToastTone = "success" | "error" | "warning" | "info";

// export type ConfirmOptions = {
// 	title: string;
// 	description: string;
// 	confirmLabel?: string;
// 	cancelLabel?: string;
// 	tone?: "danger" | "primary";
// 	/** Se informado, o diálogo fica aberto ("Processando...") até terminar. Se lançar erro, o erro aparece dentro do diálogo. */
// 	onConfirm?: () => Promise<unknown> | void;
// };

// export type AlertOptions = {
// 	title: string;
// 	description: string;
// 	actionLabel?: string;
// 	/** false = não fecha com Esc nem clicando fora (bloqueio). */
// 	dismissible?: boolean;
// 	onAction?: () => void;
// };

export type ToastAPI = {
	/** Resolve true se confirmou (e onConfirm, se existir, terminou sem erro). */
	// confirm: (options: ConfirmOptions) => Promise<boolean>;
	/** Retorna uma função que fecha o alerta. */
	// alert: (options: AlertOptions) => () => void;
	
	/** pops a toast message for user. */
	push: (tone: ToastTone, message: string) => void
	// toast: {
	// 	success: (message: string) => void;
	// 	error: (message: string) => void;
	// 	warning: (message: string) => void;
	// 	info: (message: string) => void;
	// };
};

export const ToastsContext = createContext<ToastAPI | null>(null);

export default function useToast(): ToastAPI {
	const context = useContext(ToastsContext);
	if (!context) {
		throw new Error("useToast deve ser usado dentro de <ToastProvider>.");
	}
	return context;
}