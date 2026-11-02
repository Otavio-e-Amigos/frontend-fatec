import { useMemo } from "react";
import {
	Link,
} from "react-router";
import DefaultTableModel from "~/classes/TableModels/DefaultTableModel";
import ComplexTableModelView from "~/components/tables/ComplexTableView";
import useBlockedPage from "~/hooks/useBlockedPage";
import Header from "~/layouts/Header";
import PageHeader from "~/layouts/pages/PageHeader";
import AuthService from "~/modules/user/auth.service";
import type User from "~/modules/user/user.class";
import mapper from "./@mappers/user-table.mapper";

// No sistema, quem administra é o perfil "TI". "RESPONSAVEL" não acessa a Gestão.
const ADMIN_PROFILE = "TI";

// users pode chegar undefined: o UserService.get devolve undefined quando a API recusa a listagem.
export default function Page({ users }: { users?: User[] }) {

	const currentUser = AuthService.hasUserToken()
		? AuthService.getUserToken()
		: null;

	const isBlocked = useBlockedPage(currentUser?.profile !== ADMIN_PROFILE, {
		title: "Gestão restrita",
		description:
			"Apenas usuários do perfil TI podem acessar a gestão do sistema.",
	});

	const usersTable = useMemo(() => {
		const rows = (users ?? []).map(mapper);

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
