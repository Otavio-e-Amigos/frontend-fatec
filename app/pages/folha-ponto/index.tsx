import Header from "~/layouts/Header";
import PageHeader from "~/layouts/pages/PageHeader";
import type Professor from "~/modules/professor/professor.class";
import useFolhaPonto from "./@hooks/useFolhaPonto";
import FolhaPontoForm from "./@layouts/FolhaPontoForm";
import FolhaPontoPreview from "./@layouts/FolhaPontoPreview";

/** Escolha de professor/mês, prévia da folha e download do documento. */
export default function FolhaPontoPage({
	professores,
}: {
	professores: Professor[];
}) {
	const page = useFolhaPonto();

	return (
		<div className="flex flex-1 min-h-screen flex-col">
			<Header activeItem="Folha de Ponto" />
			<main className="flex flex-1 flex-col gap-5 mx-5 my-4">
				<PageHeader
					subTitle="Documentos"
					title="Folha de Ponto"
					description="Escolha o professor e o mês, confira a prévia e baixe o documento oficial."
				/>

				<FolhaPontoForm professores={professores} {...page.form} />

				{page.preview.data && (
					<FolhaPontoPreview
						data={page.preview.data}
						downloading={page.preview.downloading}
						onDownload={page.preview.onDownload}
					/>
				)}
			</main>
		</div>
	);
}