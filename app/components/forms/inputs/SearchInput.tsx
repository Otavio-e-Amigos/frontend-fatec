import { useContext } from "react";
import { FormInputContext } from "../FormInput";
import { Search } from "iconoir-react";

export default function SearchInput() {
	const { basicInputParameters, events, currentFormattedValue } =
		useContext(FormInputContext);

	return (
		<div className="form-input flex flex-row gap-3 items-center">
			<Search />
			<input
				{...basicInputParameters}
				type="search"
				className="w-full"
				onChange={events?.onChange}
			/>
		</div>
	);
}
