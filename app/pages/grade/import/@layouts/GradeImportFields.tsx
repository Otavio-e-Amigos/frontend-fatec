import type { ReactNode } from "react";
import type { Option } from "~/modules/grade/extraction/grade-extraction.types";

type FieldProps = {
	label: string;
	error?: string;
	required?: boolean;
	children: ReactNode;
};

export function Field({ label, error, required, children }: FieldProps) {
	return (
		<label className="flex min-w-0 flex-col gap-1 text-sm font-medium text-ink-muted">
			<span>
				{label}
				{required && " *"}
			</span>
			{children}
			{error && <span className="text-danger-fg">{error}</span>}
		</label>
	);
}

const inputClass = (error?: string) =>
	`form-input${error ? " border-danger-fg" : ""}`;

export function TextInput({
	value, onChange, error, type = "text", maxLength,
}: {
	value: string;
	onChange: (value: string) => void;
	error?: string;
	type?: string;
	maxLength?: number;
}) {
	return (
		<input
			className={inputClass(error)}
			type={type}
			value={value}
			maxLength={maxLength}
			onChange={(event) => onChange(event.currentTarget.value)}
		/>
	);
}

export function NumberInput({
	value, onChange, error, step = 1, min = 0,
}: {
	value: number | null;
	onChange: (value: number | null) => void;
	error?: string;
	step?: number;
	min?: number;
}) {
	return (
		<input
			className={inputClass(error)}
			type="number"
			step={step}
			min={min}
			value={value ?? ""}
			onChange={(event) =>
				onChange(event.currentTarget.value === "" ? null : Number(event.currentTarget.value))
			}
		/>
	);
}

export function SelectInput({
	value, onChange, options, error,
}: {
	value: string;
	onChange: (value: string) => void;
	options: Option[];
	error?: string;
}) {
	return (
		<select
			className={inputClass(error)}
			value={value}
			onChange={(event) => onChange(event.currentTarget.value)}
		>
			<option value="">Selecione...</option>
			{options.map((option) => (
				<option key={option.value} value={option.value}>
					{option.label}
				</option>
			))}
		</select>
	);
}

export function Pill({ registered }: { registered: boolean }) {
	return registered ? (
		<span className="rounded-full bg-ok-bg px-2 py-0.5 text-xs font-medium text-ok-fg">
			Já cadastrado
		</span>
	) : (
		<span className="rounded-full bg-neutral-bg px-2 py-0.5 text-xs font-medium text-neutral-fg">
			Será cadastrado
		</span>
	);
}