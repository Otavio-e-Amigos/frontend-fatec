import { useContext } from "react";
import type { WindowHookOptions } from "./window.types";
import { WindowManagerContext } from "./window.contexts";

export default function useWindow(options?: WindowHookOptions) {
	const context = useContext(WindowManagerContext);
	if (!context) {
		throw new Error("useWindow deve ser usado dentro de <WindowProvider>.");
	}

	if (options?.wrapper) context.setWrapper(options.wrapper);
	if (options?.initialData) {
		context.setInitialData(undefined);
		context.setData(options.initialData);
	}
	if (options?.extras) {
		context.setExtras(undefined);
		context.setExtras(options.extras);
	}

	return context;
}
