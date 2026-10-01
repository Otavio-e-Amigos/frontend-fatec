import { createContext, Form, useNavigate } from "react-router";
import FormContainer from "~/components/forms/FormContainer";
import FormInput from "~/components/forms/FormInput";
import Header from "~/layouts/Header";
import Professor from "~/modules/professor/professor.class";
import FormController, {
	InputValidator,
} from "../../components/forms/FormController";
import type { SubmitEventHandler, SyntheticEvent } from "react";
import ProfessorService from "~/modules/professor/professor.service";
import User from "~/modules/user/user.class";

function FormSection({
	section,
	description,
	children,
}: {
	section: string;
	description: string;
	children: any;
}) {
	return (
		<section className="grid grid-cols-2">
			{/*<div className="flex flex-row gap-15 w-full">*/}
			<aside className="flex flex-row gap-4">
				<div className="mr-20 flex flex-col w-full">
					<p>{section}</p>
					<p className="text-sm text-gray-400">{description}</p>
				</div>

				<div className="min-w-1.5 min-h-10 rounded-full bg-header-bg/15" />
			</aside>
			<main className="flex flex-col my-3 ml-5 gap-3 justify-start">
				{children}
			</main>
			{/*</div>*/}
		</section>
	);
}

function PhoneFormatter(value: string) {
	console.log(value);
	const newValue = value.trim();

	function format() {
		const digits = value.replace(/\D/g, "").slice(0, 11);
		if (digits.length > 7) {
			return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
		} else if (digits.length > 2) {
			return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
		} else if (digits.length > 0) {
			return `(${digits}`;
		}
		return digits;
	}

	const displayValue = format();
	return { newValue, displayValue };
}

function CPFFormatter(value: string) {
	console.log(value);
	const newValue = value.trim();

	function format() {
		const digits = value.replace(/\D/g, "").slice(0, 15);

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

function LegalNameFormatter(value: string) {
	const newValue = value.replaceAll(/^\w$|\s\w/g, (p) => {
		console.log(p);
		return p.toUpperCase();
	});
	return { newValue, displayValue: newValue };
}

class PhoneNumberValidator extends InputValidator {
	constructor() {
		super(/^\d{11}$/);
	}
}

async function submitData(
	event: SyntheticEvent<HTMLFormElement>,
	mode: "add" | "edit",
	controller: FormController,
	id?: number,
) {
	event.preventDefault();
	const data = Object.fromEntries(new FormData(event.currentTarget));
	console.log("data from form: ", data);

	// export form as plain object or class directly using mapper if viable
	const profRaw = {
		name: data.nome as string,
		cpf: data.cpf as string,
		registry: data.matricula as string,
		contract: data.regimeContrato as string,
		status: data.status as string,
		title: data.titulacao as string,
		code: data.codigo as string,
		// id: data.id as string,
	};

	// TODO if classes throws errors, they must be inserted inside try..catch scope and treated properly
	const prof = new Professor(
		profRaw.name,
		profRaw.cpf,
		profRaw.registry,
		profRaw.contract,
		profRaw.status,
		profRaw.title,
		profRaw.code,
		id,
	);
	// console.log("prof", prof);

	const auth = new User(JSON.parse(localStorage.getItem("auth") as string));

	try {
		// inserts edit or save method depending on method's mode
		const res =
			mode === "add"
				? await ProfessorService.save(prof, auth)
				: await ProfessorService.edit(id!, prof, auth);

		console.log(
			"looks like it saved, this is the data ProfessorService returned:",
			res,
		);

		if (res) {
			return res

		}
		// redirect user to newly created professor page
		// redirect(`/professor/${res.id}`)
	} catch (e) {
		// ValidationError(400, fields: {name: "Name must not contain blablabla", cpf: "this is not a !@#$%& number!"}) => fills fields with error messages
		// 	REFLECT must be interesting if we can make FormController read those messages and applies them automatically to fields
		// AutheticationError(401, "not authorized/authenticated.") => redirects user to page or a popup window appears for authenticating first before sending to not lose data.
		// ServerError(500, "Something wrong happened") => sends user to Internal error page or fills global error message to internal error.
	}

	// validate form (as it is already formatted and validated through InputValidator when exiting FormInput)
	// 	REFLECT if validation rules are applicable on classes too, does it sounds interesting to make them like classes or something like this to be used on anywhere?

	// create professor object with data
	// send object to ProfessorService
	// check if result was success
	// 	if true, redirects user to it's own page
	// 	if false, return with errors and behaves accordigly
	// 		if validation is the cause (400), fill fields with errors (CPF duplicates, error that came from API)
	// 		if 401 (unauthorized | authentication error basically), redirects user to login page or popups login window before proceeding
	// 		if server error 500, redirects user to Internal Server error page or shows global error message in formulary
}

export default function Page({ professor }: { professor?: Professor }) {
	const navigate = useNavigate()
	const controller = new FormController();

	const formMode = professor ? "edit" : "add";

	const submit = async (e: SyntheticEvent<HTMLFormElement>) =>
	{
		const res = await submitData(e, formMode, controller, professor?.id);
		if (res) {
			navigate("/professor")
		}
	}
	if (professor) {
		controller.addField("nome", professor.name);
		controller.addField("cpf", professor.cpf);

		controller.addField("matricula", professor.registry);
		controller.addField("regimeContrato", professor.contract);
		controller.addField("status", professor.status);
		controller.addField("codigo", professor.code);
		controller.addField("titulacao", professor.title);

		// controller.addField("email", professor.name)
		// controller.addField("teams", professor.name)
		// controller.addField("telefone", professor.name)
	}

	// controller.addField("formControllerField01", "value that came from API to #01");

	// controller.addField("formControllerField02", "Test");
	// controller.setFieldError("formControllerField02", {
	// 	message:
	// 		"#02: This field should format as a telephone field, try pressing letters and filling it normally.",
	// });

	// controller.addField(
	// 	"formControllerField03",
	// 	"field with value that is not correct",
	// );
	// controller.setFieldError("formControllerField03", {
	// 	message: "Error! #03's value not correct!",
	// });
	// console.log("decoy");
	// console.log(controller);
	const editMode = formMode === "edit" ? true : false;
	return (
		<main className="flex flex-1 flex-col">
			<Header activeItem="Professores" />

			{/* TODO LOW add stateful variable here */}
			{professor && (
				<h1 className="text-4xl my-5 mx-2">Editar dados de {professor.name}</h1>
			)}
			<FormContainer
				initialController={controller}
				onSubmit={submit}
				className="flex flex-col gap-8 m-5"
			>
				{/*
					REFLECT i think i can use hidden value inputs for managing states between formatted value objects,
					or i could just go object-based on FormController
					*/}
				{/*<input type="hidden" disabled name="disabled_value_shouldnt_be_here" value={"i believe this value shouldn't appear on console log since it's disabled?"}/>*/}
				<FormSection
					section={"Informações Básicas"}
					description={"Informações basicas sobre o Professor à ser adicionado"}
				>
					<FormInput
						required={!editMode}
						name={"nome"}
						type="text"
						label="Nome Completo"
					/>
					<FormInput
						required={!editMode}
						name={"cpf"}
						type="text"
						label="CPF"
					/>
					{/*<FormInput required name={"professor"} type="text" label="Cursos" />*/
					/* TO BE ADDED LATER */}
				</FormSection>

				<FormSection
					section={"Dados de Docente"}
					description={
						"Dados relacionados a vida acadêmica deste Professor dentro da institução"
					}
				>
					<FormInput
						required={!editMode}
						name={"matricula"}
						type="text"
						label="Matrícula"
					/>

					{/* TODO change to select with restricted options (DETERMIADO, INDETERMINADO, TEMPORARIO) */}
					{/*<FormInput
						required={!editMode}
						name={"contrato"}
						type="text"
						label="Contrato"
					/>*/}
					<div className="flex flex-col">
						<label>
							Contrato {!editMode && <span className="text-rose-500">*</span>}
						</label>
						<select name="regimeContrato" defaultValue={"DETERMINADO"} className="form-input">
							<option value={"DETERMINADO"} selected>
								Determinado
							</option>
							<option value={"INDETERMINADO"}>Indeterminado</option>
							<option value={"TEMPORARIO"}>Temporário</option>
						</select>
					</div>

					{/* TODO change to according value */}
					{/*<FormInput
						required={!editMode}
						name={"status"}
						type="text"
						label="Status"
					/>*/}
					<div className="flex flex-col">
						<label>
							Status {!editMode && <span className="text-rose-500">*</span>}
						</label>
						<select name="status" className="form-input">
							<option value={"ATIVO"} selected>
								Ativo
							</option>
							<option value={"INATIVO"}>Inativo</option>
							<option value={"AFASTADO"}>Afastado</option>
						</select>
					</div>

					{/* TODO change to according value */}
					{/*<FormInput name={"titulacao"} type="text" label="Titulação" />*/}
					<div className="flex flex-col">
						<label>
							Titulação {!editMode && <span className="text-rose-500">*</span>}
						</label>
						<select name="titulacao" className="form-input">
							<option value={"GRADUADO"} selected>
								Graduado
							</option>
							<option value={"ESPECIALISTA"}>Especialista</option>
							<option value={"MESTRE"}>Mestre</option>
							<option value={"DOUTOR"}>Doutor</option>
							<option value={"POS_DOUTOR"}>Pós Doutorado</option>
						</select>
					</div>

					{/* TODO change to according value */}
					<FormInput name={"codigo"} type="text" label="Código" />
				</FormSection>

				{/*<FormSection
					section={"Extras"}
					description={
						"Informações extras que podem facilitar o contato do Docente ou para outros aspectos que possam te ajudar."
					}
				>
					<FormInput name={"email"} type="text" label="E-Mail" />
					<FormInput name={"teams"} type="text" label="Usuário Teams" />
					<FormInput name={"telefone"} type="text" label="Telefone" />
				</FormSection>*/}

				{/* DELETE THIS ASAP */}
				{/*
					<FormContainer
					controller={decoy}
					className="flex flex-1 flex-col gap-10 my-5 mx-20"
					>
					<FormInput
						type="text"
						name={"formControllerField01"}
						label="FormController Field #01"
					/>
					<FormInput
						type="text"
						InputFormatter={PhoneFormatter}
						validator={new PhoneNumberValidator()}
						name={"formControllerField02"}
						label="FormController Field #02"
					/>
					<FormInput
						type="text"
						name={"formControllerField03"}
						label="FormController Field #03"
					/>

					<FormInput
						type="text"
						name={"formControllerField04"}
						InputFormatter={CPFFormatter}
						label="FormController Field #03"
					/>

					<FormInput
						type="text"
						name={"formControllerField05"}
						InputFormatter={LegalNameFormatter}
						label="FormController Field #04"
					/>
					<button type="submit">Submit</button>
				</FormContainer>*/}
				<button type="submit" className="flex btn btn-success">
					{professor ? "Salvar Alterações" : "Adicionar"}
				</button>
			</FormContainer>
		</main>
	);
}
