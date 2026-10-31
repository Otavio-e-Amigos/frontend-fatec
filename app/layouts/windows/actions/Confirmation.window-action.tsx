import { useContext, useState } from "react";
import { WindowContext } from "~/components/windows/window.contexts";

export default function ConfirmationWindowAction({
	idleState,
}: {
	idleState: string;
}) {
	const window = useContext(WindowContext);
	const extras: { onConfirm?: any, onCancel?: any } = window.extras ?? { onConfirm: () => {}, onCancel: () => {} };
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function confirm() {
		setIsSubmitting(true);
		try {
			await extras.onConfirm?.();
			// console.log("handling confirmation!")
			await window.handleConfirm?.();
		} finally {
			setIsSubmitting(false);
		}
	}

	async function cancel() {
		setIsSubmitting(true);
		try {
			await extras.onCancel?.();
			await window.handleCancel?.();
		} finally {
			setIsSubmitting(false);
		}
	}

	// console.log("<ConfirmationWindowAction> window: ", window);
	// console.log("<ConfirmationWindowAction> extras: ", extras);

	return (
		<div className="flex flex-row gap-2">
			<button
				type="button"
				className="btn"
				data-variant="secondary"
				onClick={cancel}
				disabled={isSubmitting}
			>
				Cancelar
			</button>
			<button
				type="button"
				className="btn"
				data-variant={"danger"}
				onClick={confirm}
				disabled={isSubmitting}
			>
				{isSubmitting ? "Processando..." : idleState}
			</button>
		</div>
	);
}
