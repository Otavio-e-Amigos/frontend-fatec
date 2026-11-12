import { useContext } from "react";
import { FormInputContext } from "../../FormInput";

export default function DefaultErrorMessage() {
	const { errorMessage } = useContext(FormInputContext);
	return <div className="text-sm text-hint-alert-dot">{errorMessage}</div>;
}
