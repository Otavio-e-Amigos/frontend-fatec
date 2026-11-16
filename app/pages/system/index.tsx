import { useMemo } from "react";
import { Link } from "react-router";
import DefaultTableModel from "~/classes/TableModels/DefaultTableModel";
import ComplexTableModelView from "~/components/tables/ComplexTableView";
import useBlockedPage from "~/hooks/useBlockedPage";
import Header from "~/layouts/Header";
import PageHeader from "~/layouts/pages/PageHeader";
import AuthService from "~/modules/user/auth.service";
import type User from "~/modules/user/user.class";
import mapper from "./@mappers/user-table.mapper";
import { Plus } from "iconoir-react";
import GenericFloor from "~/layouts/pages/GenericFloor";
import ChartCard from "~/components/charts/ChartCard";
import { BarraSimples } from "~/components/charts/Charts";
import type { CadastroTotal } from "~/modules/estatisticas/estatisticas.service";

// No sistema, quem administra é o perfil "TI". "RESPONSAVEL" não acessa a Gestão.
const ADMIN_PROFILE = "TI";

// users pode chegar undefined: o UserService.get devolve undefined quando a API recusa a listagem.
export default function Page({
	users,
	cadastros = [],
}: {
	users?: User[];
	cadastros?: CadastroTotal[];
}) {
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
							<Plus />
							<p>Novo Usuário</p>
						</Link>
					}
				/>
				<GenericFloor className="p-4">
					<ChartCard
						title="Cadastros do sistema"
						description="Quantidade de itens em cada cadastro. Muda ao incluir ou excluir registros."
						empty={cadastros.length === 0}
						emptyMessage="Não foi possível carregar os totais."
					>
						<BarraSimples data={cadastros} label="Cadastrados" />
					</ChartCard>
				</GenericFloor>
				<ComplexTableModelView data={usersTable} actionsColumn />
			</main>
		</div>
	);
}
