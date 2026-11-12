import { useContext } from "react";
import { FormInputContext } from "../FormInput";
import DefaultLabel from "./default/DefaultLabel";
import DefaultErrorMessage from "./default/DefaultErrorMessage";

export default function SelectInput() {
	const { input, currentFormattedValue } = useContext(FormInputContext);

	return (
		<div className="flex flex-col">
			<DefaultLabel />

			<select name={input?.name} className="form-input">
				{input?.options &&
					Object.entries(input?.options).map(([label, value], idx) => (
						<option
							key={idx}
							value={value}
							selected={value === currentFormattedValue}
						>
							{label}
						</option>
					))}
			</select>

			<DefaultErrorMessage />
		</div>
	);
}
