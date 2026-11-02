import { createContext } from "react";
import type { WindowAPI, WindowManagerAPI } from "./window.types";

export const WindowContext = createContext<WindowAPI>({
	hide: () => {},
	show: () => {},
});

export const WindowManagerContext = createContext<WindowManagerAPI | undefined>(
	undefined,
);
