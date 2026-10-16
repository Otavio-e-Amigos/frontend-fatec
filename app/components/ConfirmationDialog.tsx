import { useEffect, useRef, useState } from "react";

type ConfirmationDialogProps = {
	title: string;
	description: string;
	confirmLabel: string;
	errorMessage?: string;
	onConfirm: () => Promise<void> | void;
	onCancel: () => void;
};

export default function ConfirmationDialog({
	title,
	description,
	confirmLabel,
	errorMessage,
	onConfirm,
	onCancel,
}: ConfirmationDialogProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const isSubmittingRef = useRef(isSubmitting);
	const cancelButton = useRef<HTMLButtonElement>(null);
	const onCancelRef = useRef(onCancel);
	isSubmittingRef.current = isSubmitting;
	onCancelRef.current = onCancel;

	useEffect(() => {
		cancelButton.current?.focus();
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape" && !isSubmittingRef.current) {
				onCancelRef.current();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	async function confirm() {
		setIsSubmitting(true);
		try {
			await onConfirm();
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<div
			className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
			onClick={() => {
				if (!isSubmitting) onCancel();
			}}
		>
			<section
				role="alertdialog"
				aria-modal="true"
				aria-labelledby="confirmation-title"
				aria-describedby="confirmation-description"
				className="surface w-full max-w-md rounded-card p-6 shadow-card"
				onClick={(event) => event.stopPropagation()}
			>
				<h2 id="confirmation-title" className="text-xl font-semibold text-ink">
					{title}
				</h2>
				<p id="confirmation-description" className="mt-2 text-sm text-ink-muted">
					{description}
				</p>
				{errorMessage && (
					<p className="mt-3 text-sm text-hint-warning" role="alert">
						{errorMessage}
					</p>
				)}
				<div className="mt-6 flex justify-end gap-2">
					<button
						ref={cancelButton}
						type="button"
						className="btn"
						data-variant="secondary"
						onClick={onCancel}
						disabled={isSubmitting}
					>
						Cancelar
					</button>
					<button
						type="button"
						className="btn"
						data-variant="danger"
						onClick={confirm}
						disabled={isSubmitting}
					>
						{isSubmitting ? "Processando..." : confirmLabel}
					</button>
				</div>
			</section>
		</div>
	);
}
