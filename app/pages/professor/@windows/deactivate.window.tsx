import type { WindowHookOptions } from "~/components/windows/window.types";
import BasicWindow from "~/layouts/windows/BasicWindow";
import ConfirmationWindowAction from "~/layouts/windows/actions/Confirmation.window-action";


const deactivateWindow:WindowHookOptions = {
	wrapper: <BasicWindow/>,
	initialData: {
		title: "Desativar Professor?",
		dismissible: true,
		tone: "warning",
		actions: <ConfirmationWindowAction idleState={"Desativar"}/>,
	}
}

export default deactivateWindow;
