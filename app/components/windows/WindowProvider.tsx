import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRevalidator } from "react-router";
import {
	WindowContext,
	type WindowAPI,
	type WindowManagerAPI,
} from "~/hooks/useWindow";

function useWindowDataState() {
	const [initialWindowData, setInitialWindowData] = useState<
		WindowAPI | undefined
	>(undefined);

	const [currentWindowData, setCurrentWindowData] = useState<
		WindowAPI | undefined
	>(undefined);

	const windowData = useMemo(() => {
		return currentWindowData ?? initialWindowData ?? {};
	}, [initialWindowData, currentWindowData]);

	useEffect(() => {

		if (currentWindowData && !initialWindowData) {
			setInitialWindowData(currentWindowData);
			console.log("setting initial window data!");
			console.log(initialWindowData);
		}
	}, [windowData]);

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
	const [WrapperFunction, setWrapper] = useState<any>(undefined); // Função para definir wrapper
	const [windowData, setData, setInitialData] = useWindowDataState();
	const [extras, setExtras] = useState<any>(undefined)
	// const { revalidate } = useRevalidator();

	function hide() {
		setVisible(false);
	}

	function show(data?: WindowAPI) {
		setData(data);
		setVisible(true);
	}

	const windowStates = {
		hide,
		show,
	};

	const Wrapper = useMemo(() => {
		console.log(windowData)
		const windowProperties = {
			...windowData,
			...windowStates,
		};
		return WrapperFunction && <WrapperFunction window={windowProperties} extras={extras} />;
	}, [WrapperFunction, windowData]);

	const WindowManager = useMemo<WindowManagerAPI>(() => {
		return {
			setWrapper(Wrapper: any) {
				// setWrapper(undefined)
				setWrapper((prev: any) => prev || Wrapper);
			},
			setData,
			...windowStates,
			setInitialData,
			setExtras
		};
	}, []);

	return (
		<WindowContext value={WindowManager}>
			{children}

			{visible && Wrapper && Wrapper}
		</WindowContext>
	);
}
