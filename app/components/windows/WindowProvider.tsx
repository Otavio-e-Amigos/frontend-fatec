import { useMemo, useState, type ReactNode } from "react";
import type { WindowAPI, WindowManagerAPI } from "./window.types";
import { WindowContext, WindowManagerContext } from "./window.contexts";

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
			console.log("setting initial window data!", initialWindowData);
			console.log("currentWindowData", currentWindowData);
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

export default function WindowProvider({ children }: { children: ReactNode }) {
	const [visible, setVisible] = useState<boolean>(false);
	const [WrapperFunction, setFunctionWrapper] = useState<any>(undefined); // Função para definir wrapper
	const [InitialWrapper, setInitialWrapper] = useState<any>(undefined); // Função para definir wrapper inicial
	const [windowDataState, setData, setInitialData] = useWindowDataState();
	const [extras, setExtras] = useState<any>(undefined);

	function hide() {
		setVisible(false);
		setFunctionWrapper(InitialWrapper);
	}

	function show(data?: WindowAPI, wrapper?: any) {
		if (wrapper) {
			setFunctionWrapper(wrapper);
		}
		setData(data);
		setVisible(true);
	}

	const windowStates = {
		hide,
		show,
	};

	const windowData: WindowAPI = {
		...windowStates,
		...windowDataState,
		...extras, //might break if something is implemented differently on extras attributes, confirm and patch
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
		</WindowManagerContext.Provider>
	);
}
