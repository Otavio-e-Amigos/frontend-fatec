export default function NotificationBadge({
	state,
	description,
	action,
}: {
	state: string;
	description: string;
	action: any;
}) {
	return (
		<div className="p-2 flex flex-1 flex-row items-start gap-2 rounded-xl border-2 border-x-slate-500 border-y-slate-400 bg-slate-100">
			<img src="/favicon.ico" className="size-6" />
			<div className="flex flex-col gap-1">
				<div className="flex-1">{description}</div>
				{action}
			</div>
		</div>
	);
}
