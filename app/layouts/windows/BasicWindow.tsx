import { createContext } from "react";
import type { WindowAPI } from "~/hooks/useWindow";

export const WindowExtrasContext = createContext<any>(undefined)

export default function BasicWindow({ window, extras }: { window: WindowAPI, extras: any }) {
	return (
		<div
			className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
			onClick={() => {
				console.log("click!", window);
				if (window?.dismissible) {
					console.log("exiting window!");
					window?.hide?.();
				}
			}}
		>
			<section
				role="alertdialog"
				aria-modal="true"
				// aria-labelledby="alert-title"
				// aria-describedby="alert-description"
				className="surface w-full max-w-md rounded-card p-6 shadow-card"
				onClick={(event) => event.stopPropagation()}
			>
				<h2 id="alert-title" className="text-xl font-semibold text-ink">
					{window?.title}
				</h2>
				<p id="alert-description" className="mt-2 text-sm text-ink-muted">
					{window?.description}
				</p>
				<div className="mt-6 flex justify-end">
					<WindowExtrasContext value={extras}>
						{window.actions}
					</WindowExtrasContext>
					{/*<button
						ref={actionButton}
						type="button"
						className="btn"
						onClick={() => {
							onAction?.();
							onClose();
						}}
					>
						{actionLabel}
					</button>*/}
				</div>
			</section>
		</div>
	);
}
