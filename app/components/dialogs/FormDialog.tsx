import { useEffect, type ReactNode } from "react";

type FormDialogProps = {
	onClose: () => void;
	children: ReactNode;
};

export default function FormDialog({ onClose, children }: FormDialogProps) {
	useEffect(() => {
		function onKeyDown(event: KeyboardEvent) {
			if (event.key !== "Escape") return;
			// Se uma confirmação estiver aberta por cima, o Esc é dela.
			if (document.querySelector('[role="alertdialog"]')) return;
			onClose();
		}
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [onClose]);

	return (
		<div
			className="fixed inset-0 z-40 grid place-items-center overflow-y-auto bg-black/50 p-4"
			onMouseDown={(event) => {
				if (event.target === event.currentTarget) onClose();
			}}
		>
			<div role="dialog" aria-modal="true" className="relative w-full max-w-xl">
				<button
					type="button"
					aria-label="Fechar"
					className="absolute right-3 top-3 z-10 text-xl leading-none text-ink-muted hover:text-ink"
					onClick={onClose}
				>
					×
				</button>
				{children}
			</div>
		</div>
	);
}