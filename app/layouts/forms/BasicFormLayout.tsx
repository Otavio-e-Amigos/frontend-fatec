import GenericFloor from "../pages/GenericFloor";

function FormHeader({
	title,
	description,
}: {
	title: string;
	description?: string;
}) {
	return (
		<div className="flex flex-col px-4 py-3">
			<h1 className="text-xl font-bold text-red-950">{title}</h1>
			<p className="text-xs text-brand-shade">{description}</p>
		</div>
	);
}

export default function BasicFormLayout({
	children,
	title,
	description,
	Form,
	// window,
}: {
	children: any;
	title: string;
	description?: string;
	Form: any;
	window?: any;
}) {
	return (
		<GenericFloor
			header={<FormHeader title={title} description={description} />}
		>
			<Form className="flex flex-col gap-8 p-5">{children}</Form>
		</GenericFloor>
	);
}
