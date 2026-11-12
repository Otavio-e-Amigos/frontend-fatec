import {
	// cloneElement,
	useContext,
} from "react";
import { FormInputContext } from "../FormInput";
import DefaultLabel from "./default/DefaultLabel";
// import GenericInput from "./GenericInput";
import { Eye, EyeClosed, Lock } from "iconoir-react";
import DefaultErrorMessage from "./default/DefaultErrorMessage";

export default function PasswordInput() {
	const { revealed, setRevealed, labelAlign, basicInputParameters, events } =
		useContext(FormInputContext);

	return (
		<div className={`flex ${labelAlign}`}>
			<DefaultLabel />

			<div className="form-input flex items-center gap-1 pr-1">
				<Lock />

				<input
					onChange={events?.onChange}
					onBlur={events?.onBlur}
					{...basicInputParameters}
					type={revealed ? "text" : "password"}
					className="w-full min-w-0"
				/>

				<button
					type="button"
					className="input-toggle"
					aria-label={revealed ? "Ocultar senha" : "Mostrar senha"}
					aria-pressed={revealed}
					onClick={() => setRevealed((r) => !r)}
				>
					{revealed ? <Eye /> : <EyeClosed />}
				</button>
			</div>

			<DefaultErrorMessage />
		</div>
	);
}
