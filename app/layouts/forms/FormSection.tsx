export default function FormSection({
	section,
	description,
	children,
}: {
	section: string;
	description: string;
	children: any;
}) {
	return (
		<section className="grid grid-cols-2">
			{/*<div className="flex flex-row gap-15 w-full">*/}
			<aside className="flex flex-row gap-4">
				<div className="mr-20 flex flex-col w-full">
					<p>{section}</p>
					<p className="text-sm text-gray-400">{description}</p>
				</div>

				<div className="min-w-1.5 min-h-10 rounded-full bg-header-bg/15" />
			</aside>
			<main className="flex flex-col my-3 ml-5 gap-3 justify-start">
				{children}
			</main>
			{/*</div>*/}
		</section>
	);
}
