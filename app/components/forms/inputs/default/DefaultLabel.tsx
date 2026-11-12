import { useContext } from "react";
import { FormInputContext } from "../../FormInput";

export default function DefaultLabel() {
	const { input } = useContext(FormInputContext);

	return (
		<label htmlFor={input?.name}>
			{input?.label}{" "}
			{!input?.hideRequiredLabel && input?.required && (
				<span className="text-hint-alert-dot">*</span>
			)}
		</label>
	);
}
