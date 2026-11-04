import { Link } from "react-router";
import Header from "~/layouts/Header";
import PageHeader from "~/layouts/pages/PageHeader";
import type { GradePageProps } from "../grade-page.types";
import useGradeImport from "./@hooks/useGradeImport";
import GradeImportDoneDialog from "./@layouts/GradeImportDoneDialog";
import GradeImportForm from "./@layouts/GradeImportForm";
import GradeImportRegistry from "./@layouts/GradeImportRegistry";
import GradeImportUpload from "./@layouts/GradeImportUpload";

/** Composes the PDF upload, the review forms, the registry summary and the result dialog. */
export default function GradeImportPage(props: GradePageProps) {
	const state = useGradeImport(props);

	return (
		<div className="flex min-h-screen flex-1 flex-col">
			<Header activeItem="Grade" />
			<main className="mx-5 my-4 flex flex-1 flex-col gap-5">
				<PageHeader
					subTitle="Recursos Acadêmicos"
					title="Importar grade"
					description="Envie a grade horária em PDF, confira os dados e salve."
					headerItems={
						<Link className="btn" data-variant="outline" to="/grade">
							Voltar às grades
						</Link>
					}
				/>
				<GradeImportUpload state={state} />
				{state.data && <GradeImportForm state={state} />}
				{state.data && <GradeImportRegistry state={state} />}
			</main>
			{state.result && <GradeImportDoneDialog result={state.result} />}
		</div>
	);
}