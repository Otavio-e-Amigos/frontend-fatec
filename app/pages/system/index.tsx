import { useMemo, useState } from "react";
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
import FloorHeader from "~/layouts/pages/FloorHeader";

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

	const [activeTab, setActiveTab] = useState(0);
	const [tabElement, setTabElement] = useState(<></>);

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

	function TabItem({ label, tabIndex }: { label: string; tabIndex: number }) {
		return (
			<button
				className={`surface p-2 ${tabIndex == activeTab ? "bg-page-surface-outline/20" :  "hover:bg-page-surface-accent"} active:bg-page-surface-outline/20`}
				onClick={() => {
					setActiveTab(tabIndex);
				}}
			>
				{label}
			</button>
		);
	}

	return (
		<div className="flex flex-1 flex-col">
			<Header />
			<main className="mx-5 my-4 flex flex-1 flex-col gap-5">
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
				<div className="grid grid-cols-4 flex-1 grid-rows-2 gap-5">
					<GenericFloor className="flex flex-col gap-3 p-3 max-h-fit">
						<FloorHeader title={"Seções"}/>
						<TabItem label={"Usuários"} tabIndex={0} />
						<TabItem label={"Estatísticas"} tabIndex={1} />
					</GenericFloor>
					<div className="col-span-3 row-span-2">
						{activeTab == 1 && (
							<GenericFloor
								className="p-4 flex flex-col gap-5"
								header={
									<div className="mx-4 my-3">
										<FloorHeader
											title={"Estatísticas"}
											description={"Análise e estatísticas dos recursos do Appointer"}
										/>
									</div>
								}
							>
								{/*<ChartCard
									title="Recursos"
									description="Recursos cadastrados no Appointer"
									empty={cadastros.length === 0}
									emptyMessage="Não foi possível carregar os totais."
								>
								</ChartCard>*/}
								<FloorHeader
									title={"Recursos"}
									description={"Recursos cadastrados no sistema"}
								/>
								<BarraSimples data={cadastros} label="Cadastrados" />
							</GenericFloor>
						)}

						{activeTab == 0 && (
							<GenericFloor className="p-4"
								header={
									<div className="mx-4 my-3">
										<FloorHeader
											title={"Usuários"}
											description={"Consulta dos usuários registrados no Appointer"}
										/>
									</div>
								}
							>
								<ComplexTableModelView data={usersTable} actionsColumn />
							</GenericFloor>
						)}
					</div>
				</div>



			</main>
		</div>
	);
}
