import { useEffect, useRef } from "react";

type AlertDialogProps = {
	title: string;
	description: string;
	actionLabel?: string;
	dismissible?: boolean;
	onAction?: () => void;
	onClose: () => void;
};

export default function AlertDialog({
	title,
	description,
	actionLabel = "Entendi",
	dismissible = true,
	onAction,
	onClose,
}: AlertDialogProps) {
	const actionButton = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		actionButton.current?.focus();
		if (!dismissible) return;
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [dismissible, onClose]);

	return (
		<div
			className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
			onClick={() => {
				if (dismissible) onClose();
			}}
		>
			<section
				role="alertdialog"
				aria-modal="true"
				aria-labelledby="alert-title"
				aria-describedby="alert-description"
				className="surface w-full max-w-md rounded-card p-6 shadow-card"
				onClick={(event) => event.stopPropagation()}
			>
				<h2 id="alert-title" className="text-xl font-semibold text-ink">
					{title}
				</h2>
				<p id="alert-description" className="mt-2 text-sm text-ink-muted">
					{description}
				</p>
				<div className="mt-6 flex justify-end">
					<button
						ref={actionButton}
						type="button"
						className="btn"
						onClick={() => {
							onAction?.();
							onClose();
						}}
					>
						{actionLabel}
					</button>
				</div>
			</section>
		</div>
	);
}