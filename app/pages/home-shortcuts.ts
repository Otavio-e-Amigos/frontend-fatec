import type User from "~/modules/user/user.class";

type Profile = NonNullable<User["profile"]>;

export type HomeShortcut = {
	title: string;
	description: string;
	href: string;
	/** Perfis que enxergam o atalho. Sem este campo, todos enxergam. */
	profiles?: Profile[];
	/**
	 * Gancho para as imagens: quando preenchido, o card mostra a imagem no topo.
	 * Ex.: image: "/home/professores.png" (arquivo em public/home/)
	 */
	image?: string;
};

const homeShortcuts: HomeShortcut[] = [
	{
		title: "Adicionar Professor",
		description: "Cadastre um novo docente e o tipo de contrato.",
		href: "/professor/add",
	},
	{
		title: "Adicionar Disciplina",
		description: "Cadastre uma disciplina para usar na criação das grades.",
		href: "/disciplina/add",
	},
	{
		title: "Adicionar Curso",
		description: "Cadastre um novo curso no sistema.",
		href: "/curso/add",
	},
	{
		title: "Adicionar Período Letivo",
		description: "Cadastre um novo período letivo.",
		href: "/periodo-letivo/add",
	},
	{
		title: "Gestão",
		description: "Gerencie os usuários e os recursos do sistema.",
		href: "/system",
		profiles: ["TI"],
	},
];

export default homeShortcuts;