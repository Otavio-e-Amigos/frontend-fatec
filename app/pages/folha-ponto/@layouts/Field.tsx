import type { ReactNode } from "react";
import type { Opcao } from "~/modules/folha-ponto/folha-ponto.types";

export function CardHeader({ title, description }: { title: string; description?: string }) {
	return (
		<div className="flex flex-col px-4 py-3">
			<h1 className="text-xl font-bold text-red-950">{title}</h1>
			{description && <p className="text-xs text-brand-shade">{description}</p>}
		</div>
	);
}

export function Field({
	label, error, required, children,
}: { label: string; error?: string; required?: boolean; children: ReactNode }) {
	return (
		<label className="flex min-w-0 flex-col gap-1 text-sm text-ink">
			<span>
				{label}
				{required && <span className="text-hint-alert-dot"> *</span>}
			</span>
			{children}
			{error && <span className="text-hint-alert-dot">{error}</span>}
		</label>
	);
}

const cls = (error?: string) => `form-input${error ? " border-hint-alert-dot" : ""}`;

export function TextInput({
	value, onChange, error, type = "text", maxLength, placeholder,
}: {
	value: string; onChange: (v: string) => void; error?: string;
	type?: string; maxLength?: number; placeholder?: string;
}) {
	return (
		<input
			className={cls(error)}
			type={type}
			value={value}
			maxLength={maxLength}
			placeholder={placeholder}
			onChange={(e) => onChange(e.target.value)}
		/>
	);
}

export function NumberInput({
	value, onChange, error, step = 1, min = 0,
}: {
	value: number | null; onChange: (v: number | null) => void; error?: string;
	step?: number; min?: number;
}) {
	return (
		<input
			className={cls(error)}
			type="number"
			step={step}
			min={min}
			value={value ?? ""}
			onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
		/>
	);
}

export function SelectInput({
	value, onChange, options, error,
}: { value: string; onChange: (v: string) => void; options: Opcao[]; error?: string }) {
	return (
		<select className={cls(error)} value={value} onChange={(e) => onChange(e.target.value)}>
			<option value="">Selecione</option>
			{options.map((o) => (
				<option key={o.value} value={o.value}>
					{o.label}
				</option>
			))}
		</select>
	);
}