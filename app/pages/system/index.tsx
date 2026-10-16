import { useState } from "react";
import { Link, useNavigate } from "react-router";
import DefaultTableModel from "~/classes/TableModels/DefaultTableModel";
import ConfirmationDialog from "~/components/ConfirmationDialog";
import ComplexTableModelView from "~/components/tables/ComplexTableView";
import Header from "~/layouts/Header";
import AuthService from "~/modules/user/auth.service";
import UserService from "~/modules/user/user.service";
import User from "~/modules/user/user.class";

export default function Page({ users }: { users: User[] }) {
	const navigate = useNavigate();
	const auth = AuthService.getUserToken();
	const [userToDeactivate, setUserToDeactivate] = useState<User | null>(null);
	const [deactivationError, setDeactivationError] = useState<string>();


	async function activateUser(id: number) {
		const res = await UserService.activate(id, auth);
		if (res) {
			navigate(0);
		}
	}

	async function deactivateUser(id: number) {
		try {
			const res = await UserService.deactivate(id, auth);
			if (res) {
				setUserToDeactivate(null);
				navigate(0);
			} else {
				setDeactivationError("Não foi possível desativar o usuário. Tente novamente.");
			}
		} catch (error) {
			setDeactivationError(
				error instanceof Error
					? error.message
					: "Ocorreu um erro ao desativar o usuário.",
			);
		}
	}

	console.log(users);
	const userTableList = users.map((user) => [
		{
			value: user.name,
			display: (
				<p key={user.id}>
					{user.name}
				</p>
			),
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
						onClick={() => {
							if (user.active) {
								setDeactivationError(undefined);
								setUserToDeactivate(user);
							} else {
								void activateUser(user.id!);
							}
						}}
					>
						{user.active ? "Desativar" : "Ativar"}
					</button>
				</div>
			),
		},
	]);

	const usersTable = new DefaultTableModel(userTableList, [
		"Usuário",
		"Login",
		"Ativo?",
		"Perfil",
		"",
	]);

	return (
		<div className="flex flex-1 flex-col">
			<Header />
			<main className="mt-5">
				<h1 className="text-3xl mx-2">Gerenciamento do sistema</h1>
				<section className="flex flex-col gap-2 mx-10 my-5">
					<Link
						to={"/system/user/add"}
						className="btn"
						data-variant="outline"
						data-size="sm"
					>
						Adicionar Usuário
					</Link>
					<ComplexTableModelView data={usersTable} actionsColumn />
				</section>
			</main>
			{userToDeactivate && (
				<ConfirmationDialog
					title="Desativar usuário?"
					description={`O usuário ${userToDeactivate.name ?? ""} perderá o acesso ao sistema enquanto estiver desativado.`}
					confirmLabel="Desativar"
					errorMessage={deactivationError}
					onConfirm={() => deactivateUser(userToDeactivate.id!)}
					onCancel={() => setUserToDeactivate(null)}
				/>
			)}
		</div>
	);
}
