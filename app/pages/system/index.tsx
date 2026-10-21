import { useMemo } from "react";
import { Link, useRevalidator } from "react-router";
import getErrorMessage from "~/classes/errors/get-error-message";
import DefaultTableModel from "~/classes/TableModels/DefaultTableModel";
import ComplexTableModelView from "~/components/tables/ComplexTableView";
import useBlockedPage from "~/hooks/useBlockedPage";
import useDialogs from "~/hooks/useDialogs";
import Header from "~/layouts/Header";
import PageHeader from "~/layouts/PageHeader";
import AuthService from "~/modules/user/auth.service";
import type User from "~/modules/user/user.class";
import UserService from "~/modules/user/user.service";

// No sistema, quem administra é o perfil "TI". "RESPONSAVEL" não acessa a Gestão.
const ADMIN_PROFILE = "TI";

// users pode chegar undefined: o UserService.get devolve undefined quando a API recusa a listagem.
export default function Page({ users }: { users?: User[] }) {
	const dialogs = useDialogs();
	const { revalidate } = useRevalidator();

	const currentUser = AuthService.hasUserToken()
		? AuthService.getUserToken()
		: null;

	const isBlocked = useBlockedPage(currentUser?.profile !== ADMIN_PROFILE, {
		title: "Gestão restrita",
		description:
			"Apenas usuários do perfil TI podem acessar a gestão do sistema.",
	});

	async function activateUser(user: User) {
		try {
			const res = await UserService.activate(
				user.id!,
				AuthService.getUserToken(),
			);
			if (!res) throw new Error();
			dialogs.toast.success(`${user.name} foi ativado.`);
			revalidate();
		} catch (error) {
			dialogs.toast.error(
				getErrorMessage(error, "Não foi possível ativar o usuário."),
			);
		}
	}

	async function deactivateUser(user: User) {
		const done = await dialogs.confirm({
			title: "Desativar usuário?",
			description: `O usuário ${user.name ?? ""} perderá o acesso ao sistema enquanto estiver desativado.`,
			confirmLabel: "Desativar",
			tone: "danger",
			onConfirm: async () => {
				const res = await UserService.deactivate(
					user.id!,
					AuthService.getUserToken(),
				);
				if (!res) {
					throw new Error(
						"Não foi possível desativar o usuário. Tente novamente.",
					);
				}
			},
		});
		if (done) {
			dialogs.toast.success(`${user.name} foi desativado.`);
			revalidate();
		}
	}

	const usersTable = useMemo(() => {
		const rows = (users ?? []).map((user) => [
			{
				value: user.name,
				display: <p key={user.id}>{user.name}</p>,
			},
			user.login,
			user.active ? "Ativo" : "Inativo",
			user.profile,
			{
				value: 0,
				display: (
					<div key={user.id} className="row-actions">
						<Link
							className="btn"
							data-variant="icon"
							data-icon="edit"
							title="Editar"
							to={`/system/user/${user.id}/edit`}
						>
							Editar
						</Link>
						<button
							type="button"
							className="btn"
							data-variant="icon"
							data-icon="power"
							title={user.active ? "Desativar" : "Ativar"}
							onClick={() =>
								user.active ? void deactivateUser(user) : void activateUser(user)
							}
						>
							{user.active ? "Desativar" : "Ativar"}
						</button>
					</div>
				),
			},
		]);

		return new DefaultTableModel(rows as any, [
			"Usuário",
			"Login",
			"Ativo?",
			"Perfil",
			"",
		]);
	}, [users]);

	// O return antecipado vem depois de TODOS os hooks (useBlockedPage, useMemo...),
	// senão o React reclama de mudança na ordem dos hooks.
	if (isBlocked) {
		return (
			<div className="flex flex-1 flex-col">
				<Header />
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col">
			<Header />
			<main className="mx-5 my-4 flex flex-col gap-5">
				<PageHeader
					title={"Sistema"}
					subTitle={"Gestão do Sistema"}
					description={
						"Opções e recursos disponíveis para o gerenciamento do sistema"
					}
					headerItems={
						<Link
							className="btn w-fit"
							data-variant="outline"
							data-size="sm"
							to="user/add"
						>
							+ Novo Usuário
						</Link>
					}
				/>
				<ComplexTableModelView data={usersTable} actionsColumn />
			</main>
		</div>
	);
}
