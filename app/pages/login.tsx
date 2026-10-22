import FormInput from "~/components/forms/FormInput";
import { LoadingGeral } from "~/components/loaders/LoadingGeral";
import useForm from "~/hooks/useForm";
import login from "~/modules/user/@actions/login.action";
import { Link, useSearchParams } from "react-router";
import useDialogs from "~/hooks/useDialogs";
import { useEffect } from "react";

/** Displays the application login using the institutional visual identity. */
export default function LoginPage() {
	const { FormContainer, isSubmitting } = useForm({ actions: login });
	const dialogs = useDialogs();
	const [params] = useSearchParams();

	useEffect(() => {
		if (params.get("sessao") === "expirada") {
			dialogs.toast.info("Sua sessão expirou. Faça login novamente.");
		}
	}, []);
	return (
		<div className="login-page">
			{isSubmitting && (
				<LoadingGeral mensagem="Validando suas credenciais..." />
			)}
			<header className="login-header">
				<div className="login-header-inner">
					<Link className="login-brand" to="/" aria-label="Appointer - início">
						<BrandMark />
						<span className="login-brand-copy">
							<strong>Appointer</strong>
							<small>SISTEMA DE FOLHA DE PONTO FATEC</small>
						</span>
					</Link>
					<div className="login-institution" aria-label="Centro Paula Souza">
						<strong>CPS</strong>
						<span>Centro<br />Paula Souza</span>
					</div>
				</div>
			</header>

			<main className="login-main">
				<section className="login-story" aria-labelledby="login-story-title">
					<LoginIllustration />
					<div className="login-story-copy">
						<p className="login-eyebrow">GESTÃO DOCUMENTAL INTEGRADA</p>
						<h1 id="login-story-title">Da grade semanal ao documento final.</h1>
						<p className="login-description">
							Organize calendários, revise informações docentes e gere arquivos
							PDF com segurança em um único ambiente.
						</p>
						<ul className="login-feature-list" aria-label="Recursos">
							<li>Grades semanais</li>
							<li>Calendário letivo</li>
							<li>Geração de PDF</li>
						</ul>
					</div>
				</section>

				<section className="login-panel" aria-labelledby="login-title">
					<div className="login-panel-heading">
						<p className="login-eyebrow">PORTAL ADMINISTRATIVO</p>
						<h2 id="login-title">Acesse sua conta</h2>
						<p>Use suas credenciais institucionais para continuar.</p>
					</div>

					<FormContainer className="login-form">
						<div className="login-field-wrap">
							<svg
								viewBox="0 0 20 20"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
								aria-hidden="true"
							>
								<circle cx="10" cy="6.5" r="3" />
								<path d="M4.5 17c.4-3.1 2.2-4.7 5.5-4.7s5.1 1.6 5.5 4.7" />
							</svg>
							<FormInput
								required
								name="user"
								type="text"
								label="Usuário institucional"
								placeholder="nome.sobrenome ou e-mail"
							/>
						</div>
						<p className="login-field-help">
							Digite o usuário ou e-mail fornecido pela instituição.
						</p>

						<div className="login-password-heading">
							<label htmlFor="pass">Senha</label>
						</div>
						<div className="login-field-wrap">
							<svg
								className="login-password-icon"
								viewBox="0 0 20 20"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
								aria-hidden="true"
							>
								<rect x="4.5" y="8.5" width="11" height="8" rx="1.5" />
								<path d="M7 8.5V6a3 3 0 0 1 6 0v2.5" />
							</svg>
							<FormInput
								required
								hideRequiredLabel
								name="pass"
								type="password"
								label=""
								placeholder="Digite sua senha"
							/>
						</div>

						<button
							type="submit"
							className="login-submit"
							disabled={isSubmitting}
						>
							{isSubmitting ? "Validando..." : "Entrar no sistema"}
						</button>
					</FormContainer>

					<p className="login-support">
						Problemas para acessar?{" "}
						<span>Fale com o suporte da unidade</span>
					</p>
					<p className="login-security-note">
						Acesso restrito a usuários autorizados · Ambiente institucional
						seguro
					</p>
				</section>
			</main>
		</div>
	);
}

/** Draws the Appointer symbol with the existing institutional red. */
function BrandMark() {
	return (
		<svg
			className="login-brand-mark"
			viewBox="0 0 40 40"
			fill="none"
			aria-hidden="true"
		>
			<circle cx="20" cy="20" r="7" fill="currentColor" />
			<circle cx="20" cy="6" r="5" fill="currentColor" />
			<circle cx="20" cy="34" r="5" fill="currentColor" />
			<circle cx="6" cy="20" r="5" fill="#555" />
			<circle cx="34" cy="20" r="5" fill="#555" />
		</svg>
	);
}

/** Shows an original illustration of a timetable, document, and secure access. */
function LoginIllustration() {
	return (
		<div className="login-illustration" aria-hidden="true">
			<svg viewBox="0 0 420 280" fill="none">
				<ellipse cx="206" cy="202" rx="174" ry="60" fill="#F9EBEB" />
				<rect
					x="85"
					y="73"
					width="213"
					height="153"
					rx="12"
					fill="white"
					stroke="#949494"
					strokeWidth="3"
				/>
				<rect x="103" y="91" width="177" height="13" rx="4" fill="#F9EBEB" />
				<rect x="103" y="114" width="94" height="9" rx="4.5" fill="#DADADA" />
				<rect x="103" y="133" width="147" height="9" rx="4.5" fill="#DADADA" />
				<rect x="103" y="152" width="127" height="9" rx="4.5" fill="#DADADA" />
				<rect x="103" y="183" width="176" height="22" rx="5" fill="#B20000" />
				<path d="M191 227v20m0 0h-27m27 0h27" stroke="#555" strokeWidth="4" />
				<rect
					x="56"
					y="67"
					width="78"
					height="78"
					rx="13"
					fill="white"
					stroke="#949494"
					strokeWidth="3"
				/>
				<path d="M57 93h76" stroke="#B20000" strokeWidth="7" />
				<path d="M74 57v18m42-18v18" stroke="#B20000" strokeWidth="4" />
				<rect x="71" y="105" width="12" height="12" rx="2" fill="#F9EBEB" />
				<rect x="91" y="105" width="12" height="12" rx="2" fill="#B20000" />
				<rect x="111" y="105" width="12" height="12" rx="2" fill="#F9EBEB" />
				<path
					d="M277 77a10 10 0 0 1 10-10h65l30 30v92a10 10 0 0 1-10 10h-85a10 10 0 0 1-10-10V77Z"
					fill="white"
					stroke="#B20000"
					strokeWidth="3"
				/>
				<path d="M352 68v31h30" stroke="#B20000" strokeWidth="3" />
				<rect x="295" y="117" width="62" height="9" rx="4.5" fill="#DADADA" />
				<rect x="295" y="136" width="69" height="9" rx="4.5" fill="#DADADA" />
				<rect x="295" y="155" width="45" height="9" rx="4.5" fill="#DADADA" />
				<path
					d="m344 185 26-12 26 12v25c0 22-15 37-26 43-11-6-26-21-26-43v-25Z"
					fill="#B20000"
				/>
				<path
					d="m359 207 8 8 15-18"
					stroke="white"
					strokeWidth="5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<circle cx="22" cy="75" r="5" stroke="#D32719" />
				<circle cx="402" cy="94" r="4" fill="#D32719" />
			</svg>
		</div>
	);
}
