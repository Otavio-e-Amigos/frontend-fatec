import { useState } from "react";
import FormInput from "~/components/forms/FormInput";
import useForm from "~/hooks/useForm";
import Header from "~/layouts/Header";
import FormSection from "~/layouts/forms/FormSection";
import saveUser from "~/modules/user/@actions/save.action";
import type User from "~/modules/user/user.class";

/** Renders the system user form and displays submission failures. */
export default function Page({ user }: { user?: User }) {
	const [submitError, setSubmitError] = useState("");
	const { FormContainer, isSubmitting } = useForm({
		actions: saveUser,
		actionsExtras: {
			id: user?.id,
			setSubmitError,
		},
	});

	return (
		<>
			<Header />
			<main className="mx-5 mt-5">
				<h1 className="mb-5 text-3xl">
					{user ? "Editar usuário" : "Adicionar usuário"}
				</h1>
				{submitError && (
					<p className="mb-4 text-sm text-danger-fg" role="alert">
						{submitError}
					</p>
				)}
				<FormContainer className="surface flex max-w-2xl flex-col gap-4 rounded-card border border-line p-5">
					<FormSection
						section="Informações básicas"
						description="Informações do usuário que acessará o sistema."
					>
						<FormInput
							required
							name="user"
							type="text"
							label="Usuário"
							value={user?.name ?? user?.login ?? ""}
						/>
						<FormInput
							required
							name="pass"
							type="password"
							label={user ? "Nova senha" : "Senha"}
							value=""
						/>
						<FormInput
							required
							name="profile"
							type="select"
							label="Perfil de usuário"
							options={{
								TI: "TI",
								Responsável: "RESPONSAVEL",
							}}
							value={user?.profile ?? "TI"}
						/>
					</FormSection>
					<button
						type="submit"
						className="btn self-start"
						disabled={isSubmitting}
					>
						{isSubmitting
							? "Salvando..."
							: user
								? "Salvar alterações"
								: "Adicionar"}
					</button>
				</FormContainer>
			</main>
		</>
	);
}
