import { Link, useNavigate } from "react-router";
import DefaultTableModel from "~/classes/TableModel/DefaultTableModel";
import ComplexTableModelView from "~/components/tables/ComplexTableView";
import Header from "~/layouts/Header";
import { auth } from "~/mock/db/users.db";
import type User from "~/modules/user/user.class";
import UserService from "~/modules/user/user.service";

export default function Page({ users }: { users: User[] }) {
	const navigate = useNavigate();

	async function activateUser(id: number) {
		const res = await UserService.activate(id, auth);
		if (res) {
			navigate(0);
		}
	}

	async function deactivateUser(id: number) {
		const res = await UserService.deactivate(id, auth);
		if (res) {
			navigate(0);
		}
	}
	console.log(users);
	const userTableList = users.map((user) => [
		{
			value: user.name,
			display: (
				// <Link key={user.id} className="link" to={`/usuario/${user.id}`}>
				// 	{user.name}
				// </Link>
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
				<div key={user.id} className="flex flex-row gap-2 justify-center">
					<button
						key={user.id}
						className="btn btn-normal"
						onClick={(e) => {
							user.active ? deactivateUser(user.id!) : activateUser(user.id!);
							e.currentTarget.disabled = true;
						}}
					>
						{user.active ? "Desativar" : "Ativar"}
					</button>
					<Link
						key={user.id}
						className="btn btn-normal"
						to={`/system/user/${user.id}/edit`}
					>
						Editar
					</Link>
				</div>
			),
		},
	]);

	const usersTable = new DefaultTableModel(userTableList, [
		"Usuário",
		"Login",
		"Ativo?",
		"Perfil",
		"Estado",
	]);

	return (
		<div className="flex flex-1 flex-col">
			<Header />
			<main className="mt-5">
				<h1 className="text-3xl mx-2">Gerenciamento do sistema</h1>
				<section className="flex flex-col gap-2 mx-10 my-5">
					<Link to={"/system/user/add"} className="btn btn-normal">
						Adicionar Usuário
					</Link>
					<ComplexTableModelView data={usersTable} />

					{/*<button
						className="btn btn-normal"
						onClick={async () => {
							UserService.activate(9, auth);
						}}
					>
						Ativar usuário user01
					</button>
					<button
						className="btn btn-normal"
						onClick={async () => {
							UserService.deactivate(9, auth);
						}}
					>
						Desativar usuário user01
					</button>*/}
				</section>
			</main>
		</div>
	);
}
