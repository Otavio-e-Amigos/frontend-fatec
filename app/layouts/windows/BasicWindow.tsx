import { useContext } from "react";
import ShadowCenter from "../containers/ShadowCenter";
import { WindowContext } from "~/components/windows/window.contexts";

export default function BasicWindow() {
	const window = useContext(WindowContext);

	function exitWindow() {
		if (window?.dismissible) {
			window?.hide();
		}
	}

	return (
		<ShadowCenter onClick={exitWindow}>
			<section
				role="alertdialog"
				// aria-modal="true" //accessibility features, may be interesting implementing this later
				className="floor w-full max-w-md rounded-card p-6 shadow-card"
				onClick={(event) => event.stopPropagation()}
			>
				<h2
					id="alert-title"
					className={`${window.tone === "danger" ? "text-red-950" : "text-ink"} text-xl font-semibold`}
				>
					{window?.title}
				</h2>
				<p id="alert-description" className="mt-2 text-sm text-ink-muted">
					{window?.description}
				</p>
				<div className="mt-6 flex justify-end">
					{window?.body}

					{window.actions}
				</div>
			</section>
		</ShadowCenter>
	);
}
