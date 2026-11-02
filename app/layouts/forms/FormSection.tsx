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
		<section className="flex flex-col rounded-lg gap-5">
			<aside className="flex flex-col gap-2">
				<div className="flex flex-col w-full">
					<p className="text-2xl text-slate-700 font-medium">{section}</p>
					<p className="text-xs text-gray-500">{description}</p>
				</div>

				<div className="min-h-0.5 rounded-lg bg-page-surface-outline/25" />
			</aside>
			<main className="flex flex-col gap-3">{children}</main>
		</section>
	);
}
