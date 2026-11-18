import FormInput from "~/components/forms/FormInput";
import FloorHeader from "./FloorHeader";

export default function SearchBarHeader({
	title,
	description,
	termStateSetter,
	displayTermStateSetter,
}: {
	title: string;
	description: string;
	termStateSetter: Function;
	displayTermStateSetter: Function;
}) {
	return (
		<section className="flex flex-row justify-end items-center gap-5 mx-4 my-3">
			<div className="w-full">
				<FloorHeader title={title} description={description} />
			</div>
			<div className="w-110">
				<FormInput
					type="search"
					name={"search"}
					placeholder="Pesquisar..."
					onChange={(event: any) => {
						termStateSetter(event.currentTarget.value.toLowerCase().trim());
						displayTermStateSetter(event.currentTarget.value);
					}}
				/>
			</div>
		</section>
	);
}
