import type { MouseEvent, ReactNode } from "react";
import { Link } from "react-router";

// Ações de linha da tabela: botões quadrados só com ícone, na última coluna.
// Uso:
//   <RowActions>
//     <EditAction to={`/professor/${id}/edit`} />
//     <ToggleAction active={ativo} onClick={() => desativar(id)} />
//   </RowActions>
// e na tabela: <ComplexTableModelView data={...} actionsColumn />

function Icon({ children }: { children: ReactNode }) {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden
		>
			{children}
		</svg>
	);
}

const PencilIcon = () => (
	<Icon>
		<path d="M10.5 3 13 5.5 5.5 13H3v-2.5L10.5 3Z" />
		<path d="m9 4.5 2.5 2.5" />
	</Icon>
);

const PowerIcon = () => (
	<Icon>
		<path d="M8 2v5.5" />
		<path d="M4.7 4.4a5 5 0 1 0 6.6 0" />
	</Icon>
);

const TrashIcon = () => (
	<Icon>
		<path d="M3 4.5h10" />
		<path d="M6.5 4.5V3h3v1.5" />
		<path d="m4.5 4.5.6 8.5h5.8l.6-8.5" />
		<path d="M6.8 7v3.5M9.2 7v3.5" />
	</Icon>
);

type Tone = "default" | "danger" | "ok";

export function RowActions({ children }: { children: ReactNode }) {
	return <div className="row-actions">{children}</div>;
}

// o rótulo vira tooltip (title) e nome acessível (aria-label) do botão
export function ActionLink({
	to,
	label,
	tone = "default",
	children,
}: {
	to: string;
	label: string;
	tone?: Tone;
	children: ReactNode;
}) {
	return (
		<Link
			to={to}
			className="icon-btn"
			data-tone={tone}
			title={label}
			aria-label={label}
		>
			{children}
		</Link>
	);
}

export function ActionButton({
	onClick,
	label,
	tone = "default",
	children,
}: {
	onClick: (e: MouseEvent<HTMLButtonElement>) => void;
	label: string;
	tone?: Tone;
	children: ReactNode;
}) {
	return (
		<button
			type="button"
			className="icon-btn"
			data-tone={tone}
			title={label}
			aria-label={label}
			onClick={onClick}
		>
			{children}
		</button>
	);
}

/* -= atalhos prontos =- */

export function EditAction({ to, label = "Editar" }: { to: string; label?: string }) {
	return (
		<ActionLink to={to} label={label}>
			<PencilIcon />
		</ActionLink>
	);
}

// ativo → "Desativar" (vermelho no hover); inativo → "Ativar" (verde no hover)
export function ToggleAction({
	active,
	onClick,
}: {
	active: boolean;
	onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}) {
	return (
		<ActionButton
			onClick={onClick}
			label={active ? "Desativar" : "Ativar"}
			tone={active ? "danger" : "ok"}
		>
			<PowerIcon />
		</ActionButton>
	);
}

export function DeleteAction({
	onClick,
	label = "Excluir",
}: {
	onClick: (e: MouseEvent<HTMLButtonElement>) => void;
	label?: string;
}) {
	return (
		<ActionButton onClick={onClick} label={label} tone="danger">
			<TrashIcon />
		</ActionButton>
	);
}
