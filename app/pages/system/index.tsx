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
import {
	LabelList,
	Pie,
	PieChart,
	Sector,
	type PieSectorShapeProps,
} from "recharts";

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

	const chartData = [
		{ name: "Professores", value: 10, href: "/professor" },
		{ name: "Disciplinas", value: 10, href: "/disciplina" },
		{ name: "Cursos", value: 10, href: "/curso" },
		{ name: "Períodos Letivos", value: 10, href: "/periodo-letivo" },
		{ name: "Folhas de Pontos", value: 10, href: "/folha-ponto" },
		{ name: "Grades", value: 10, href: "/grades" },
		{ name: "Usuários", value: 10, href: "/system" },
	];

	const COLORS = [
		"var(--color-chart-1)",
		"var(--color-chart-2)",
		"var(--color-chart-3)",
		"var(--color-chart-4)",
		"var(--color-chart-5)",
		"var(--color-chart-6)",
		"var(--color-chart-7)",
	];

	const MyCustomPie = (props: PieSectorShapeProps) => {
		// const p = useActiveTooltipDataPoints();
		// const isAnyPieActive = useIsTooltipActive();
		// const isThisPieActive = isAnyPieActive && props.payload === p?.[0];
		// let fillOpacity: number;
		// if (isAnyPieActive && !isThisPieActive) {
		//   fillOpacity = 0.5;
		// } else {
		//   fillOpacity = 1;
		// }
		return (
			<Sector
				{...props}
				fill={COLORS[props.index % COLORS.length]}
				// cursor={"pointer"}
				// stroke="none"
				// fillOpacity={fillOpacity}
				// style={{ transition: "fill-opacity 0.3s ease" }}
			/>
		);
	};

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
				<GenericFloor className="p-2 flex flex-col">
					pie chat lmao
					<PieChart style={{ width: "32rem", height: "20rem" }} responsive>
						{/*<PieChart className="w-full h-full" responsive>*/}
						<Pie
							data={chartData}
							dataKey="value"
							nameKey="name"
							fill="var(--color-brand)"
							// onClick={(d) => {
							// 	console.log(d.href);
							// }}
							shape={MyCustomPie}
							// innerRadius={"60%"}
							// outerRadius="70%"
						>
							<LabelList dataKey={"value"} position={"inside"} fill="white" />
							<LabelList dataKey={"name"} position={"outside"} />
						</Pie>
						{/*<Pie
						data={chartData}
						dataKey="value" nameKey="name"
						fill="var(--color-brand)"

							// innerRadius={"60%"}
							outerRadius="57%"
						/>*/}
					</PieChart>
				</GenericFloor>
				<ComplexTableModelView data={usersTable} actionsColumn />
			</main>
		</div>
	);
}
