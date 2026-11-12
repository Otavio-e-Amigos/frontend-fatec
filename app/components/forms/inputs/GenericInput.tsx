import { useContext } from "react";
import { FormInputContext } from "../FormInput";
import DefaultLabel from "./default/DefaultLabel";
import DefaultErrorMessage from "./default/DefaultErrorMessage";

export default function GenericInput() {
	const { events, input, basicInputParameters, revealed, labelAlign } =
		useContext(FormInputContext);

	return (
		<div className={`flex ${labelAlign}`}>
			<DefaultLabel />

			<input
				onChange={events?.onChange}
				onBlur={events?.onBlur}

				// onKeyUp={(e: any) => {
				// 	console.log(e.currentTarget.selectionStart);
				// }}

				{...basicInputParameters}
				id={input?.name}
				type={input?.type === "password" && revealed ? "text" : input?.type}
				className="form-input"
			/>

			<DefaultErrorMessage />
		</div>
	);
}
