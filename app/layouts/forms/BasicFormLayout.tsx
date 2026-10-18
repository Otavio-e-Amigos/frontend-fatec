export default function BasicFormLayout({
	children,
	title,
	description,
	Form,
}: {
	children: any;
	title: string;
	description?: string;
	Form: any;
}) {
	return (
		<Form className="floor flex flex-col m-5">
			<div className="floor-accent rounded-b-none border-0 border-b px-4 py-3 flex flex-col">
				<h1 className="text-xl font-bold text-red-950">
					{title}
				</h1>
				<p className="text-xs text-brand-shade">
					{description}
				</p>
			</div>
			<div className="flex flex-col gap-8 p-5">
				{children}
			</div>
		</Form>
	);
}
