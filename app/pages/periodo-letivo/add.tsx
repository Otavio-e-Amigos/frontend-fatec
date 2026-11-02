import Header from "~/layouts/Header";
import PeriodoLetivo from "~/modules/periodo-letivo/periodo-letivo.class";
import SavePeriodoForm from "./@layouts/SavePeriodoForm";

export default function Page({ periodo }: { periodo?: PeriodoLetivo }) {
	return (
		<main className="flex flex-1 flex-col">
			<Header activeItem="Períodos" />

			<div className="m-5">
				<SavePeriodoForm periodo={periodo}/>
			</div>
		</main>
	);
}
