import Header from "~/layouts/Header";
import type { GradePageProps } from "~/pages/grade/grade-page.types";
import useFolhaPonto from "./@hooks/useFolhaPonto";
import FolhaPontoCadastroDialog from "./@layouts/FolhaPontoCadastroDialog";
import FolhaPontoForm from "./@layouts/FolhaPontoForm";
import FolhaPontoUpload from "./@layouts/FolhaPontoUpload";

export default function FolhaPontoPage(props: GradePageProps) {
	const state = useFolhaPonto(props);

	return (
		<main className="flex flex-1 flex-col">
			<Header activeItem="Folha de Ponto" />
			<div className="m-5 flex flex-col gap-5">
				<FolhaPontoUpload state={state} />
				{state.dados && <FolhaPontoForm state={state} />}
			</div>
			<FolhaPontoCadastroDialog state={state} />
		</main>
	);
}