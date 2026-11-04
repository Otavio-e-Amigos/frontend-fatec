import { useEffect, useState } from "react";
import getErrorMessage from "~/classes/errors/get-error-message";
import AuthService from "~/modules/user/auth.service";
import GeminiKeyService from "~/modules/user/gemini-key.service";

/** Dev-only: sets or removes the logged user's Gemini API key. */
export default function GeminiKeyTester() {
	const [apiKey, setApiKey] = useState("");
	const [hasKey, setHasKey] = useState<boolean | null>(null);
	const [message, setMessage] = useState("");
	const [isError, setIsError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		GeminiKeyService.has(AuthService.getUserToken())
			.then(setHasKey)
			.catch(() => setHasKey(null));
	}, []);

	async function run(action: () => Promise<string>, success: boolean) {
		setIsLoading(true);
		setMessage("");
		try {
			setMessage(await action());
			setIsError(false);
			setHasKey(success);
			setApiKey("");
		} catch (e) {
			setIsError(true);
			setMessage(getErrorMessage(e, "Não foi possível concluir a operação."));
		} finally {
			setIsLoading(false);
		}
	}

	const apply = () =>
		run(() => GeminiKeyService.save(apiKey.trim(), AuthService.getUserToken()), true);
	const remove = () =>
		run(() => GeminiKeyService.remove(AuthService.getUserToken()), false);

	return (
		<section className="surface m-5 flex max-w-xl flex-col gap-3 rounded-card p-5 shadow-card">
			<h2 className="text-xl font-semibold text-brand">Chave da API do Gemini</h2>
			<p className="text-sm text-ink-muted">
				{hasKey === null
					? "Verificando..."
					: hasKey
						? "Você tem uma chave personalizada configurada."
						: "Usando a chave padrão do servidor."}
			</p>

			<input
				type="password"
				className="form-input"
				placeholder="Cole a chave aqui"
				autoComplete="off"
				value={apiKey}
				onChange={(event) => setApiKey(event.currentTarget.value)}
			/>

			<div className="flex gap-2">
				<button
					type="button"
					className="btn"
					disabled={!apiKey.trim() || isLoading}
					onClick={apply}
				>
					{isLoading ? "Validando..." : "Aplicar chave"}
				</button>
				<button
					type="button"
					className="btn"
					data-variant="outline"
					disabled={!hasKey || isLoading}
					onClick={remove}
				>
					Remover chave
				</button>
			</div>

			{message && (
				<p className={`text-sm ${isError ? "text-danger-fg" : "text-ink-muted"}`} role="alert">
					{message}
				</p>
			)}
		</section>
	);
}