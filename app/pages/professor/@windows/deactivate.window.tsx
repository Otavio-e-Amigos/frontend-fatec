import { useContext, useState } from "react";
import type { WindowHookOptions } from "~/hooks/useWindow";
import BasicWindow, { WindowExtrasContext } from "~/layouts/windows/BasicWindow";
import ConfirmationWindowAction from "~/layouts/windows/actions/Confirmation.window-action";


const deactivateWindow:WindowHookOptions = {
	wrapper: BasicWindow,
	initialData: {
		title: "Desativar Professor?",
		dismissible: true,
		tone: "warning",
		actions: <ConfirmationWindowAction idleState={"Desativar"}/>,
	}
}

export default deactivateWindow;
