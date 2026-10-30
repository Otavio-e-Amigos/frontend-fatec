import { useContext, useState } from "react";
import {
	WindowContext,
} from "~/components/windows/window.contexts";

export default function ConfirmationWindowAction({
	idleState,
}: {
	idleState: string;
}) {
	const window = useContext(WindowContext);
	const extras: { onConfirm: any } = window.extras;
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function confirm() {
		setIsSubmitting(true);
		try {
			await extras.onConfirm();
		} finally {
			setIsSubmitting(false);
		}
	}

	console.log("<ConfirmationWindowAction> extras: ", extras);

	return (
		<div className="flex flex-row gap-2">
			<button
				type="button"
				className="btn"
				data-variant="secondary"
				onClick={() => {
					window.hide();
				}}
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
