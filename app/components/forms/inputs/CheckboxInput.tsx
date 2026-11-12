import { useContext } from "react";
import { FormInputContext } from "../FormInput";
import DefaultLabel from "./default/DefaultLabel";
import DefaultErrorMessage from "./default/DefaultErrorMessage";

export default function CheckboxInput() {
	const {
		// input,
		basicInputParameters,
	} = useContext(FormInputContext);

	return (
		<div className={`flex flex-row gap-2 items-center`}>
			<input
				{...basicInputParameters}
				type={"checkbox"}
				className="form-input input-checkbox"
			/>

			<DefaultLabel />
			<DefaultErrorMessage />
		</div>
	);
}
