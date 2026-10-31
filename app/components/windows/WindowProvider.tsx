import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
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

	// useEffect(() => {

	// 	if (currentWindowData && !initialWindowData) {
	// 		setInitialWindowData(currentWindowData);
	// 		console.log("setting initial window data!", initialWindowData);
	// 		console.log("currentWindowData", currentWindowData);
	// 	}
	// }, [windowData, currentWindowData]);

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
		// hideExtraWindow();
		setVisible(false);
		setFunctionWrapper(InitialWrapper);
		// setMainWindowInvoked(false)
	}

	// useEffect(() => {
	// 	console.log("<visible>", visible);
	// 	if (visible) {
	// 		setMainWindowInvoked(true);
	// 	} else {
	// 		setMainWindowInvoked(false);
	// 	}
	// }, [visible]);

	// function isVisible() {
	// 	return visible;
	// }

	function show(data?: WindowAPIConstructor, wrapper?: any) {
		// revalidate()
		// console.log("summoning window!", visible, mainWindowInvoked);

		// if (visible) {
		// 	console.log("summoning extra window!");
		// 	showExtraWindow(data, wrapper);
		// 	return;
		// }
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
		// revalidate()
		return new Promise<boolean>((resolve) => {
			// confirmRef.current?.resolve(false);
			// setConfirmError(undefined);
			show({ ...data, resolve }, wrapper);
			// setData({ ...data, resolve });
			// setVisible(true);
			// setPendingConfirm({ ...options, resolve });
		});
	}

	function confirmExtra(data?: WindowAPIConstructor, wrapper?: any) {
		// revalidate()
		return new Promise<boolean>((resolve) => {
			// confirmRef.current?.resolve(false);
			// setConfirmError(undefined);
			showExtraWindow({ ...data, resolve }, wrapper);
			// setData({ ...data, resolve });
			// setVisible(true);
			// setPendingConfirm({ ...options, resolve });
		});
	}

	async function handleConfirm() {
		// const current = pendingConfirm;
		const current = extraWindowData ?? windowDataState;
		console.log(current);
		if (!current) return;
		try {
			await current.onConfirm?.();
			current.resolve?.(true);
			// setPendingConfirm(null);
			// there is a chance of the window funcion only hiding the extra layer due to implementation in production, test this later
			hide();
			// hide();
			// if (visible)
		} catch (error) {
			setConfirmError(getErrorMessage(error));
		}
	}

	async function handleCancel() {
		// pendingConfirm?.resolve(false);
		// setPendingConfirm(null);
		// setConfirmError(undefined);
		// hide()
		const current = windowDataState;
		console.log("<current>: ", current);
		if (!current) return;
		try {
			await current.onCancel?.();
			// if (!current.resolve) hide() //if invoked with show(), resolve function won't appeat
			current.resolve?.(false);
			// setPendingConfirm(null);
			hide();
		} catch (error) {
			setConfirmError(getErrorMessage(error));
		}
	}

	const windowStates = {
		hide,
		show,
		confirm,
		confirmExtra
	};

	// const windowStates = useMemo(() => {
	// 	// console.log("changed!")
	// 	return {
	// 		hide,
	// 		show,
	// 		confirm,
	// 	};
	// }, [visible]);

	const windowData: WindowAPI = {
		...windowStates,
		...windowDataState,
		...extras, //might break if something is implemented differently on extras attributes, confirm and patch
		handleConfirm,
		handleCancel,
	};

	// const windowData: WindowAPI = useMemo(() => {
	// 	console.log("oijkasodk")
	// 	return {
	// 		...windowStates,
	// 		...windowDataState,
	// 		...extras, //might break if something is implemented differently on extras attributes, confirm and patch
	// 		handleConfirm,
	// 		handleCancel,
	// 	};
	// }, [visible]);

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

			{/*<div className="z-50">*/}
				<WindowContext.Provider value={extraWindowData}>
					{ExtraWindowActivated && ExtraWrapperFunction && ExtraWrapperFunction}
				</WindowContext.Provider>
			{/*</div>*/}
		</WindowManagerContext.Provider>
	);
}
