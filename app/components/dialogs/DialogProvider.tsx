import {
	useCallback,
	useMemo,
	useRef,
	useState,
	type ReactNode,
} from "react";
import getErrorMessage from "~/classes/errors/get-error-message";
import {
	DialogsContext,
	type AlertOptions,
	type ConfirmOptions,
	type DialogsApi,
	type ToastTone,
} from "~/hooks/useDialogs";
import ConfirmationDialog from "../ConfirmationDialog";
import AlertDialog from "./AlertDialog";
import ApiStatusBanner from "./ApiStatusBanner";
import ToastViewport, { type ToastItem } from "./ToastViewport";

type PendingConfirm = ConfirmOptions & { resolve: (ok: boolean) => void };
type PendingAlert = AlertOptions & { id: number };

export default function DialogProvider({ children }: { children: ReactNode }) {
	const [pendingConfirm, setPendingConfirm] = useState<PendingConfirm | null>(null);
	const [confirmError, setConfirmError] = useState<string>();
	const [pendingAlert, setPendingAlert] = useState<PendingAlert | null>(null);
	const [toasts, setToasts] = useState<ToastItem[]>([]);
	const nextId = useRef(1);
	const confirmRef = useRef<PendingConfirm | null>(null);
	confirmRef.current = pendingConfirm;

	const dismissToast = useCallback((id: number) => {
		setToasts((current) => current.filter((toast) => toast.id !== id));
	}, []);

	// objeto estável: quem usa useDialogs() não re-renderiza quando um diálogo abre
	const api = useMemo<DialogsApi>(() => {
		const pushToast = (tone: ToastTone, message: string) => {
			const id = nextId.current++;
			setToasts((current) => [...current.slice(-3), { id, tone, message }]);
		};

		return {
			confirm(options) {
				return new Promise<boolean>((resolve) => {
					confirmRef.current?.resolve(false);
					setConfirmError(undefined);
					setPendingConfirm({ ...options, resolve });
				});
			},
			alert(options) {
				const id = nextId.current++;
				setPendingAlert({ ...options, id });
				return () =>
					setPendingAlert((current) => (current?.id === id ? null : current));
			},
			toast: {
				success: (message) => pushToast("success", message),
				error: (message) => pushToast("error", message),
				warning: (message) => pushToast("warning", message),
				info: (message) => pushToast("info", message),
			},
		};
	}, []);

	async function handleConfirm() {
		const current = pendingConfirm;
		if (!current) return;
		try {
			await current.onConfirm?.();
			current.resolve(true);
			setPendingConfirm(null);
		} catch (error) {
			setConfirmError(getErrorMessage(error));
		}
	}

	function handleCancel() {
		pendingConfirm?.resolve(false);
		setPendingConfirm(null);
		setConfirmError(undefined);
	}

	return (
		<DialogsContext value={api}>
			{children}

			<ApiStatusBanner />
			<ToastViewport toasts={toasts} onDismiss={dismissToast} />

			{pendingConfirm && (
				<ConfirmationDialog
					title={pendingConfirm.title}
					description={pendingConfirm.description}
					confirmLabel={pendingConfirm.confirmLabel ?? "Confirmar"}
					cancelLabel={pendingConfirm.cancelLabel}
					tone={pendingConfirm.tone ?? "primary"}
					errorMessage={confirmError}
					onConfirm={handleConfirm}
					onCancel={handleCancel}
				/>
			)}

			{pendingAlert && (
				<AlertDialog
					title={pendingAlert.title}
					description={pendingAlert.description}
					actionLabel={pendingAlert.actionLabel}
					dismissible={pendingAlert.dismissible}
					onAction={pendingAlert.onAction}
					onClose={() => setPendingAlert(null)}
				/>
			)}
		</DialogsContext>
	);
}