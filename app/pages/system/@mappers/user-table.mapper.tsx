import { Link, useRevalidator } from "react-router";
// import useDialogs from "~/hooks/useDialogs";
import useWindow from "~/components/windows/useWindow";
import ConfirmationWindowAction from "~/layouts/windows/actions/Confirmation.window-action";
import BasicWindow from "~/layouts/windows/BasicWindow";
import type Disciplina from "~/modules/disciplina/disciplina.class";
import DisciplinaService from "~/modules/disciplina/disciplina.service";
import AuthService from "~/modules/user/auth.service";
// import SaveDisciplinaForm from "../@layouts/SaveDisciplinaForm";
import type { WindowAPIConstructor } from "~/components/windows/window.types";
import type User from "~/modules/user/user.class";
import getErrorMessage from "~/classes/errors/get-error-message";
import UserService from "~/modules/user/user.service";
import useToast from "~/components/toasts/useToast";

function RowActions({ user }: { user: User }) {
	const windowData: WindowAPIConstructor = {
		title: "Desativar usuário?",
		description: `O usuário ${user.name ?? ""} perderá o acesso ao sistema enquanto estiver desativado.`,
		dismissible: true,
		tone: "danger",
		actions: <ConfirmationWindowAction idleState={"Excluir"} />,
	};
	const { revalidate } = useRevalidator();
	// const dialogs = useDialogs();
	const toast = useToast();
	const window = useWindow({
		wrapper: <BasicWindow />,
		initialData: windowData,
	});

	// async function removeDiscipline() {
	// 	window.show({
	// 		...windowData,
	// 		// description: `O usuário ${user.name ?? ""} perderá o acesso ao sistema enquanto estiver desativado.`,
	// 		extras: {
	// 			onConfirm: async () => {
	// 				const deleted = await DisciplinaService.delete(
	// 					user.id!,
	// 					AuthService.getUserToken(),
	// 				);
	// 				if (!deleted) {
	// 					throw new Error(
	// 						"Não foi possível excluir a disciplina. Tente novamente.",
	// 					);
	// 				} else {
	// 					dialogs.toast.success("Disciplina excluída com sucesso.");
	// 					revalidate();
	// 					window.hide();
	// 				}
	// 			},
	// 		},
	// 	});
	// }

	// async function edit() {
	// window.setWrapper(() => (
	// 	<SaveDisciplinaForm
	// 		disciplina={item}
	// 		onSaved={() => {
	// 			// setEditing(undefined);
	// 			window.hide();
	// 			revalidate();
	// 		}}
	// 	/>
	// ));
	// window.show(
	// 	{ dismissible: true },
	// 	<SaveDisciplinaForm
	// 		disciplina={item}
	// 		onSaved={() => {
	// 			// setEditing(undefined);
	// 			window.hide();
	// 			revalidate();
	// 		}}
	// 	/>,
	// );
	// window.show({
	// wrapper: BasicWindow,
	// dismissible: true,
	// body: (
	// 	<SaveDisciplinaForm
	// 		disciplina={item}
	// 		onSaved={() => {
	// 			// setEditing(undefined);
	// 			window.hide();
	// 			revalidate();
	// 		}}
	// 	/>
	// ),
	// });
	// }

	async function activateUser(user: User) {
		try {
			const res = await UserService.activate(
				user.id!,
				AuthService.getUserToken(),
			);
			if (!res) throw new Error();
			// dialogs.toast.success(`${user.name} foi ativado.`);
			toast.push({ tone: "success", message: `${user.name} foi ativado.` });
			revalidate();
		} catch (error) {
			toast.push({
				tone: "error",
				message: getErrorMessage(error, "Não foi possível ativar o usuário."),
			});

			// dialogs.toast.error(
			// 	,
			// );
		}
	}

	async function deactivateUser(user: User) {
		const done = await window.confirm({
			...windowData,
			extras: {
				onConfirm: async () => {
					const res = await UserService.deactivate(
						user.id!,
						AuthService.getUserToken(),
					);
					revalidate();
					if (!res) {
						throw new Error(
							"Não foi possível desativar o usuário. Tente novamente.",
						);
					}
				},
			},
		});
		if (done) {
			toast.push({ tone: "success", message: `${user.name} foi desativado.` });

			// dialogs.toast.success(`${user.name} foi desativado.`);
			revalidate();
		}
	}

	return (
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
	);
}

export default function mapper(user: User) {
	return [
		{
			value: user.name,
			display: <p key={user.id}>{user.name}</p>,
		},
		user.login,
		user.active ? "Ativo" : "Inativo",
		user.profile,
		{
			value: 0,
			display: <RowActions user={user} />,
		},
	];
}
