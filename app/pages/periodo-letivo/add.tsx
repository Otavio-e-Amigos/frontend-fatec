// import { useNavigate } from "react-router";
import BasicFormLayout from "~/layouts/forms/BasicFormLayout";
// import FormContainer from "~/components/forms/FormContainer";
import FormInput from "~/components/forms/FormInput";

import useForm from "~/hooks/useForm";
import Header from "~/layouts/Header";
import PeriodoLetivo from "~/modules/periodo-letivo/periodo-letivo.class";
import FormSection from "~/layouts/forms/FormSection";
import SavePeriodoForm from "./@layouts/SavePeriodoForm";

export default function Page({ periodo }: { periodo?: PeriodoLetivo }) {
	return (
		<main className="flex flex-1 flex-col">
			<Header activeItem="Períodos" />

			{/*<h1 className="text-4xl my-5 mx-2">Adicionar período letivo</h1>*/}
			<div className="m-5">
				<SavePeriodoForm periodo={periodo}/>
			</div>
		</main>
	);
}
