import { useContext } from "react";
import { WindowContext } from "~/components/windows/window.contexts";
import ShadowCenter from "../containers/ShadowCenter";

export default function ExpressiveWindow() {
	const window = useContext(WindowContext);

	function exitWindow() {
		if (window?.dismissible) {
			window?.hide?.();
		}
	}

	function ExitButton() {
		return (
			<div
				className="floor-accent border-y-0 border-r-0 rounded-l-none rounded-b-none flex items-center w-fit cursor-pointer hover:bg-surface"
				onClick={exitWindow}
			>
				<h2 id="alert-title" className="px-3 text-xl font-semibold text-ink">
					X
				</h2>
			</div>
		);
	}

	return (
		<ShadowCenter onClick={exitWindow}>
			<section
				className="floor w-full max-w-md rounded-card shadow-card"
				onClick={(event) => event.stopPropagation()}
			>
				<div className="floor-accent rounded-b-none border-x-0 border-t-0 flex flex-row">
					<h2 className="text-lg font-semibold text-ink py-1 px-3 w-full">
						{window?.title}
					</h2>
					<ExitButton />
				</div>
				<div className="p-6">
					<p className="mt-2 text-sm text-ink-muted">{window?.description}</p>
					<div className="mt-6 flex justify-end">
						{window?.body}

						{window.actions}
					</div>
				</div>
			</section>
		</ShadowCenter>
	);
}
