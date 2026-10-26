import { useContext } from "react";
import type { WindowHookOptions } from "~/hooks/useWindow";
import BasicWindow, { WindowExtrasContext } from "~/layouts/windows/BasicWindow";

function WindowActions() {
	const extras: {actions: {activate:Function, deactivate:Function}} = useContext(WindowExtrasContext)
	return (
		<>
			<button
				type="button"
				className="btn"
				data-variant="secondary"
				// onClick={}
				// disabled={isSubmitting}
			>
				Cancelar
			</button>
			<button
				type="button"
				className="btn"
				data-variant={"danger"}
				// onClick={confirm}
				// disabled={isSubmitting}
			>
				Confirmar
				{/*{isSubmitting ? "Processando..." : confirmLabel}*/}
			</button>
		</>
	)
}

const deactivateWindow = {
	wrapper: BasicWindow,
	initialData: {
		title: "Desativar Professor?",
		dismissible: true,
		tone: "warning",
		actions: <WindowActions/>,
	}
}

export default deactivateWindow;
