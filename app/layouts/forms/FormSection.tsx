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
		// <section className="surface grid grid-rows-2 rounded-lg">
		<section className="flex flex-col rounded-lg gap-5">
			{/*<div className="flex flex-row gap-15 w-full">*/}

			{/*<aside className="surface-accent h-fit border-b-page-surface-outline/25 rounded-b-none p-2 flex-row gap-4">*/}
			<aside className="flex flex-col gap-2">
				<div className="flex flex-col w-full">
					<p className="text-2xl text-slate-700 font-medium">{section}</p>
					<p className="text-xs text-gray-500">{description}</p>
				</div>

				<div className="min-h-0.5 rounded-lg bg-page-surface-outline/25" />
			</aside>
			{/*<main className="surface flex flex-col rounded-lg rounded-s-none py-3 px-5 gap-3 justify-start">*/}
			<main className="flex flex-col gap-3">{children}</main>
		</section>
	);
}

// <section className="floor grid grid-cols-2 p-2 rounded-lg">
// 			{/*<div className="flex flex-row gap-15 w-full">*/}
// 			<aside className="flex-row gap-4">
// 				<div className="mr-20 flex flex-col w-full">
// 					<p className="text-xl">{section}</p>
// 					<p className="text-sm text-gray-400">{description}</p>
// 				</div>

// 				<div className="min-w-1 rounded-lg bg-page-floor-outline/25" />
// 			</aside>
// 			<main className="flex flex-col my-3 ml-5 gap-3 justify-start">
// 				{children}
// 			</main>
// 			{/*</div>*/}
// 		</section>
