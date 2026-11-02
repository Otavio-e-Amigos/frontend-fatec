import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { ToastsContext, type ToastAPI, type ToastTone } from "./useToast";
import ToastViewport, { type ToastItem } from "./ToastViewport";

export default function ToastProvider({ children }: { children: ReactNode }) {
	const [toasts, setToasts] = useState<ToastItem[]>([]);
	const nextId = useRef(1);

	const dismissToast = useCallback((id: number) => {
		setToasts((current) => current.filter((toast) => toast.id !== id));
	}, []);

	// objeto estável: quem usa useDialogs() não re-renderiza quando um diálogo abre
	const API = useMemo<ToastAPI>(() => {
		const pushToast = (tone: ToastTone, message: string) => {
			const id = nextId.current++;
			setToasts((current) => [...current.slice(-3), { id, tone, message }]);
		};

		return {
			push: (toast: { tone: ToastTone; message: string }) =>
				pushToast(toast.tone, toast.message),
		};
	}, []);

	return (
		<ToastsContext value={API}>
			{children}

			<ToastViewport toasts={toasts} onDismiss={dismissToast} />
		</ToastsContext>
	);
}
