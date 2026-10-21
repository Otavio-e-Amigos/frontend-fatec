import { useEffect } from "react";
import type { ToastTone } from "~/hooks/useDialogs";

export type ToastItem = { id: number; tone: ToastTone; message: string };

const toneClass: Record<ToastTone, string> = {
	success: "border-green-300 bg-green-50 text-green-900",
	error: "border-red-300 bg-brand-soft text-red-950",
	warning: "border-amber-300 bg-amber-50 text-amber-900",
	info: "border-line bg-surface text-ink",
};

function ToastCard({
	toast,
	onDismiss,
}: {
	toast: ToastItem;
	onDismiss: (id: number) => void;
}) {
	useEffect(() => {
		const timer = setTimeout(
			() => onDismiss(toast.id),
			toast.tone === "error" ? 7000 : 4000,
		);
		return () => clearTimeout(timer);
	}, [toast.id, toast.tone, onDismiss]);

	return (
		<div
			role={toast.tone === "error" ? "alert" : "status"}
			className={`pointer-events-auto flex items-start gap-3 rounded-card border px-4 py-3 text-sm shadow-card ${toneClass[toast.tone]}`}
		>
			<p className="flex-1">{toast.message}</p>
			<button
				type="button"
				aria-label="Fechar mensagem"
				className="leading-none opacity-60 hover:opacity-100"
				onClick={() => onDismiss(toast.id)}
			>
				×
			</button>
		</div>
	);
}

export default function ToastViewport({
	toasts,
	onDismiss,
}: {
	toasts: ToastItem[];
	onDismiss: (id: number) => void;
}) {
	return (
		<div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2">
			{toasts.map((toast) => (
				<ToastCard key={toast.id} toast={toast} onDismiss={onDismiss} />
			))}
		</div>
	);
}