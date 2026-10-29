import { useContext, useState } from "react";
import { WindowExtrasContext } from "../BasicWindow";

export default function ConfirmationWindowAction({
	idleState,
}: {
	idleState: string;
}) {
	const extras: { window: { hide: any }; onConfirm: any } =
		useContext(WindowExtrasContext);
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
					extras.window.hide();
				}}
				// disabled={isSubmitting}
			>
				Cancelar
			</button>
			<button
				type="button"
				className="btn"
				data-variant={"danger"}
				onClick={confirm}
				// disabled={isSubmitting}
			>
				{/*Desativar*/}
				{isSubmitting ? "Processando..." : idleState}
			</button>
		</div>
	);
}
