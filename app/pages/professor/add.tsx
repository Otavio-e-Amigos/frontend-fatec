import { useNavigate } from "react-router";
import Header from "~/layouts/Header";
import Professor from "~/modules/professor/professor.class";
import FormController, {
	InputValidator,
} from "../../components/forms/FormController";
import type { SyntheticEvent } from "react";
import save from "~/modules/professor/actions/save.action";
import SaveProfessorForm from "./@layouts/SaveProfessorForm";

function CPFFormatter(value: string) {
	console.log(value);
	const newValue = value.trim();

	function format() {
		// const digits = value.replace(/\D/g, "").slice(0, 15);
		const digits = value.replace(/\D/g, "").slice(0, 11);

		if (digits.length > 11) {
			return digits;
		} else if (digits.length > 9) {
			return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
		} else if (digits.length > 6) {
			return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
		} else if (digits.length > 3) {
			return `${digits.slice(0, 3)}.${digits.slice(3)}`;
		} else if (digits.length <= 3) {
			return `${digits.slice(0)}`;
		}
	}

	const displayValue = format();
	return { newValue, displayValue };
}

// function LegalNameFormatter(value: string) {
// 	const newValue = value.replaceAll(/^\w$|\s\w/g, (p) => {
// 		console.log(p);
// 		return p.toUpperCase();
// 	});
// 	return { newValue, displayValue: newValue };
// }

// class PhoneNumberValidator extends InputValidator {
// 	constructor() {
// 		super(/^\d{11}$/);
// 	}
// }

export default function Page({ professor }: { professor?: Professor }) {
	const navigate = useNavigate();
	const controller = new FormController();

	const formMode = professor ? "edit" : "add";

	const submit = async (e: SyntheticEvent<HTMLFormElement>) => {
		const res = await save(e, formMode, controller, professor?.id);
		if (res) {
			navigate("/professor");
		}
	};

	if (professor) {
		// REFLECT i think i could transform those lines workflow into a single mapper function
		controller.addField("nome", professor.name);
		controller.addField("cpf", professor.cpf);

		controller.addField("matricula", professor.registry);
		controller.addField("regimeContrato", professor.contract);
		controller.addField("status", professor.status);
		controller.addField("codigo", professor.code);
		controller.addField("titulacao", professor.title);
	}

	const editMode = formMode === "edit" ? true : false;
	// TODO turn this into a PageComponent?
	return (
		<main className="flex flex-1 flex-col">
			<Header activeItem="Professores" />

			{professor && (
				<h1 className="text-4xl my-5 mx-2">Editar dados de {professor.name}</h1>
			)}

			<SaveProfessorForm
				controller={controller}
				submit={submit}
				edit={editMode}
			/>
		</main>
	);
}
