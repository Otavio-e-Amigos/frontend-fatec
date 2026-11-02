import { useMemo, useRef, useState, type ReactNode } from "react";
import type {
	WindowAPI,
	WindowAPIConstructor,
	WindowManagerAPI,
} from "./window.types";
import { WindowContext, WindowManagerContext } from "./window.contexts";
import getErrorMessage from "~/classes/errors/get-error-message";
import { useRevalidator } from "react-router";

function useWindowDataState() {
	const [initialWindowData, setInitialWindowData] = useState<
		WindowAPI | undefined
	>(undefined);

	const [currentWindowData, setCurrentWindowData] = useState<
		WindowAPI | undefined
	>(undefined);

	const windowData = useMemo(() => {
		if (currentWindowData && !initialWindowData) {
			setInitialWindowData(currentWindowData);
			// console.log("setting initial window data!", initialWindowData);
			// console.log("currentWindowData", currentWindowData);
		}

		return currentWindowData ?? initialWindowData ?? {};
	}, [initialWindowData, currentWindowData]);

	function setData(data?: WindowAPI) {
		if (!data) {
			setCurrentWindowData(undefined);
			return;
		}
		setCurrentWindowData(data);
	}

	return [windowData, setData as any, setInitialWindowData];
}

type PendingConfirm = WindowAPIConstructor & {
	resolve: (ok: boolean) => void;
	onConfirm?: any;
};

/** TODO URGENTLY: APPLY MULTI-WINDOW SYSTEM (LAYER TECHNIQUE) BEFORE SOMETHING BAD HAPPENS!!!!! */
export default function WindowProvider({ children }: { children: ReactNode }) {
	const [visible, setVisible] = useState<boolean>(false);
	const [WrapperFunction, setFunctionWrapper] = useState<any>(undefined); // Função para definir wrapper
	const [InitialWrapper, setInitialWrapper] = useState<any>(undefined); // Função para definir wrapper inicial
	const [windowDataState, setData, setInitialData] = useWindowDataState();
	const [extras, setExtras] = useState<any>(undefined);
	const { revalidate } = useRevalidator();

	const [pendingConfirm, setPendingConfirm] = useState<PendingConfirm | null>(
		null,
	);
	const confirmRef = useRef<PendingConfirm | null>(null);
	confirmRef.current = pendingConfirm;
	const [confirmError, setConfirmError] = useState<string>();

	const [mainWindowInvoked, setMainWindowInvoked] = useState<boolean>(false);

	const [ExtraWrapperFunction, setExtraFunctionWrapper] =
		useState<any>(undefined); // Função para definir wrapper extra
	const [ExtraWindowDataState, setExtraData, setExtraInitialData] =
		useWindowDataState();
	const [ExtraWindowExtras, setExtraWindowExtras] = useState<any>(undefined);
	const [ExtraWindowActivated, setExtraWindowActivated] =
		useState<boolean>(false);

	function hide() {
		if (ExtraWindowActivated) {
			hideExtraWindow();
			return;
		}
		setVisible(false);
		setFunctionWrapper(InitialWrapper);
	}

	function show(data?: WindowAPIConstructor, wrapper?: any) {
		if (wrapper) {
			setFunctionWrapper(wrapper);
		}
		setData(data);
		setVisible(true);
	}

	function showExtraWindow(data?: WindowAPIConstructor, wrapper?: any) {
		if (wrapper) {
			setExtraFunctionWrapper(wrapper);
		}
		setExtraData(data);
		setExtraWindowActivated(true);
	}

	function hideExtraWindow() {
		setExtraWindowActivated(false);
		setExtraData(undefined);
		setExtraFunctionWrapper(undefined);
	}

	function confirm(data?: WindowAPIConstructor, wrapper?: any) {
		return new Promise<boolean>((resolve) => {
			show({ ...data, resolve }, wrapper);
		});
	}

	function confirmExtra(data?: WindowAPIConstructor, wrapper?: any) {
		return new Promise<boolean>((resolve) => {
			showExtraWindow({ ...data, resolve }, wrapper);
		});
	}

	async function handleConfirm() {
		const current = extraWindowData ?? windowDataState;
		console.log(current);
		if (!current) return;
		try {
			await current.onConfirm?.();
			current.resolve?.(true);
			hide();
		} catch (error) {
			setConfirmError(getErrorMessage(error));
		}
	}

	async function handleCancel() {
		const current = windowDataState;
		console.log("<current>: ", current);
		if (!current) return;
		try {
			await current.onCancel?.();
			current.resolve?.(false);
			hide();
		} catch (error) {
			setConfirmError(getErrorMessage(error));
		}
	}

	const windowStates = {
		hide,
		show,
		confirm,
		confirmExtra,
	};

	const windowData: WindowAPI = {
		...windowStates,
		...windowDataState,
		...extras, //might break if something is implemented differently on extras attributes, confirm and patch
		handleConfirm,
		handleCancel,
	};

	const extraWindowData: WindowAPI = {
		...windowStates,
		...ExtraWindowDataState,
		...ExtraWindowExtras, //might break if something is implemented differently on extras attributes, confirm and patch
		handleConfirm,
		handleCancel,
	};

	const WindowManager = useMemo<WindowManagerAPI>(() => {
		return {
			setWrapper(Wrapper: any) {
				if (!InitialWrapper) setInitialWrapper(Wrapper);
				setFunctionWrapper(Wrapper); // setFunctionWrapper((prev: any) => prev || Wrapper); //fallback if anything breaks again because of this.
			},
			setData,
			setInitialData,
			setExtras,
			...windowStates,
		};
	}, []);

	return (
		<WindowManagerContext.Provider value={WindowManager}>
			{children}

			<WindowContext.Provider value={windowData}>
				{visible && WrapperFunction && WrapperFunction}
			</WindowContext.Provider>

			<WindowContext.Provider value={extraWindowData}>
				{ExtraWindowActivated && ExtraWrapperFunction && ExtraWrapperFunction}
			</WindowContext.Provider>
		</WindowManagerContext.Provider>
	);
}
