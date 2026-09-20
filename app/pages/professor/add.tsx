import { createContext, Form } from "react-router";
import FormContainer from "~/components/forms/FormContainer";
import FormInput from "~/components/forms/FormInput";
import Header from "~/layouts/Header";
import Professor from "~/modules/professor/professor.class";
import FormController from "./FormController";

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
					<p className="text-sm text-slate-400">{description}</p>
				</div>

				<div className="min-w-1.5 min-h-10 rounded-full bg-header-bg/15" />
			</aside>
			<main className="flex flex-col my-2 ml-5 justify-start">{children}</main>
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

export default function Page() {
	const decoy = new FormController();

	decoy.addField("formControllerField01", "value that came from API to #01");

	decoy.addField("formControllerField02", "Test");
	decoy.setFieldError("formControllerField02", {
		message:
			"#02: This field should format as a telephone field, try pressing letters and filling it normally.",
	});

	decoy.addField(
		"formControllerField03",
		"field with value that is not correct",
	);
	decoy.setFieldError("formControllerField03", {
		message: "Error! #03's value not correct!",
	});
	// console.log("decoy")
	// console.log(decoy)

	return (
		<main className="flex flex-1 flex-col">
			<Header activeItem="Professores" />

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
			</FormContainer>

			<Form>
				<FormSection
					section={"Informações Básicas"}
					description={"Informações basicas sobre o Professor à ser adicionado"}
				>
					<FormInput required name={"professor"} type="text" label="Docente" />
					<FormInput required name={"professor"} type="text" label="CPF" />
					<FormInput
						required
						name={"professor"}
						type="text"
						label="Matrícula"
					/>
					<FormInput required name={"professor"} type="text" label="Cursos" />
				</FormSection>

				<FormSection
					section={"Extras"}
					description={
						"Informações extras que podem facilitar o contato do docente ou para outros aspectos que possam te ajudar."
					}
				>
					<FormInput name={"professor"} type="text" label="E-Mail" />
					<FormInput name={"professor"} type="text" label="Usuário Teams" />
					<FormInput name={"professor"} type="text" label="Telefone" />
				</FormSection>
			</Form>
		</main>
	);
}
