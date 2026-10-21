import { Link } from "react-router";
import Header from "~/layouts/Header";
import type { GradePageProps } from "./grade-page.types";
import useGradePage from "./@hooks/useGradePage";
import GradeFocusPanel from "./@layouts/GradeFocusPanel";
import GradePageDialogs from "./@layouts/GradePageDialogs";
import GradeSelectionPanel from "./@layouts/GradeSelectionPanel";
import PageHeader from "~/layouts/PageHeader";

/** Composes the grade search, weekly view, and edit/delete dialogs. */
export default function GradePage(props: GradePageProps) {
	const page = useGradePage(props);

	return (
		<div className="flex min-h-screen flex-col">
			<Header activeItem="Grade" />
			<main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-5 px-4 py-6">
				<PageHeader subTitle={"Gestão acadêmica"} description="Consulte a grade de um professor ou cadastre uma nova." title={"Grades"} headerItems={(
					<Link className="btn" data-variant="outline" to="/professor">
						Ver professores
					</Link>
				)}/>
				{/*<header className="flex flex-wrap items-end justify-between gap-3">
					<div>
						<p className="text-xs font-semibold uppercase tracking-wide text-brand">
							Gestão acadêmica
						</p>
						<h1 className="mt-1 text-3xl font-semibold text-ink">Grades</h1>
						<p className="mt-1 text-sm text-ink-muted">
							Consulte a grade de um professor ou cadastre uma nova.
						</p>
					</div>
					<Link className="btn" data-variant="outline" to="/professor">
						Ver professores
					</Link>
				</header>*/}

				<GradeSelectionPanel {...page.selection} />
				<GradeFocusPanel {...page.focus} />
			</main>

			<GradePageDialogs {...page.dialogs} />
		</div>
	);
}
