import { Link } from "react-router";

export default function CadastroBar({
	rotulo, achado, href, podeCadastrar, dica, onCadastrar,
}: {
	rotulo: string;
	achado?: { id?: number };
	href: string;
	podeCadastrar: boolean;
	dica?: string;
	onCadastrar: () => void;
}) {
	return (
		<div className="flex flex-wrap items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-sm">
			<span className="text-ink-muted">{rotulo}:</span>
			{achado ? (
				<>
					<span className="rounded-full bg-ok-bg px-2 py-0.5 text-xs font-medium text-ok-fg">
						Já cadastrado
					</span>
					{/* nova aba, para não perder os dados extraídos */}
					<Link to={href} target="_blank" className="link">Abrir cadastro</Link>
				</>
			) : (
				<>
					<span className="rounded-full bg-neutral-bg px-2 py-0.5 text-xs font-medium text-neutral-fg">
						Não cadastrado
					</span>
					{podeCadastrar ? (
						<button type="button" className="btn" data-variant="outline" onClick={onCadastrar}>
							Cadastrar com estes dados
						</button>
					) : (
						<span className="text-xs text-ink-muted">{dica}</span>
					)}
				</>
			)}
		</div>
	);
}