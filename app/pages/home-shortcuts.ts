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
		image: "/home/professores.jpeg",
	},
	{
		title: "Adicionar Disciplina",
		description: "Cadastre uma disciplina para usar na criação das grades.",
		href: "/disciplina/add",
		image: "/home/disciplinas.jpeg",
	},
	{
		title: "Adicionar Curso",
		description: "Cadastre um novo curso no sistema.",
		href: "/curso/add",
		image: "/home/cursos.jpeg",
	},
	{
		title: "Adicionar Período Letivo",
		description: "Cadastre um novo período letivo.",
		href: "/periodo-letivo/add",
		image: "/home/periodos.jpeg",
	},
	{
		title: "Gestão",
		description: "Gerencie os usuários e os recursos do sistema.",
		href: "/system",
		profiles: ["TI"],
		image: "/home/gestao.jpeg",
	},
];

export default homeShortcuts;