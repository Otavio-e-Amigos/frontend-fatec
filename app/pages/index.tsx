import Header from "~/layouts/Header";
import PageHeader from "~/layouts/PageHeader";
import GenericFloor from "~/layouts/pages/GenericFloor";
import ShortcutCard from "~/components/cards/ShortcutCard";
import type User from "~/modules/user/user.class";
import homeShortcuts from "./home-shortcuts";

type HomePageProps = {
	name?: string;
	profile?: User["profile"];
};

function PanelHeader({
	title,
	description,
}: {
	title: string;
	description?: string;
}) {
	return (
		<div className="flex flex-col px-4 py-3">
			<h2 className="text-xl font-bold text-red-950">{title}</h2>
			{description && <p className="text-xs text-brand-shade">{description}</p>}
		</div>
	);
}

export default function Page({ name, profile }: HomePageProps) {
	// Esconde os atalhos restritos a perfis que o usuário não tem.
	const shortcuts = homeShortcuts.filter(
		(shortcut) =>
			!shortcut.profiles || (profile && shortcut.profiles.includes(profile)),
	);

	return (
		<div className="flex flex-1 flex-col">
			<Header />

			<main className="mx-5 my-4 flex flex-1 flex-col gap-5">
				<PageHeader
					subTitle="Visão geral"
					title={"Página Inicial"}
					description={`Bem-vindo de volta${name ? `, ${name}` : ""}! O que gostaria de realizar hoje?`}
				/>

				<div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
					{/* Painel principal: os cards ficam um nível acima do site */}
					<GenericFloor
						className="grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-4 p-4"
						header={
							<PanelHeader
								title="Acesso rápido"
								description="Atalhos para as principais áreas do sistema."
							/>
						}
					>
						{shortcuts.map((shortcut) => (
							<ShortcutCard key={shortcut.href} {...shortcut} />
						))}
					</GenericFloor>

					{/* Painel lateral */}
					<GenericFloor
						className="p-4"
						header={<PanelHeader title="Notificações" />}
					>
						<div className="empty-state">
							<p>Nenhuma notificação</p>
							<p>Os avisos do sistema aparecerão aqui.</p>
						</div>
					</GenericFloor>
				</div>
			</main>
		</div>
	);
}