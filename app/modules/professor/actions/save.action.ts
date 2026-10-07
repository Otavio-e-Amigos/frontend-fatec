import type { SyntheticEvent } from "react";
import type FormController from "~/components/forms/FormController";
import User from "~/modules/user/user.class";
import Professor, { type ProfessorInterface } from "../professor.class";
import ProfessorService from "../professor.service";

/**
 * Saves or edit a Professor to the application
 * @param event
 * @param mode add a new Professor or edit an existing one
 * @param controller FormController Object
 * @param id If inserted, the data sent will be saved to an existing professor
 * @returns Professor Object
 */
export default async function save(
	event: SyntheticEvent<HTMLFormElement>,
	mode: "add" | "edit", // TODO change to edit mode automatically if an id is inserted and remove this param.
	controller: FormController,
	id?: number,
) {
	event.preventDefault();
	const data = Object.fromEntries(new FormData(event.currentTarget));
	console.log("data from form: ", data);

	// export form as plain object or class directly using mapper if viable
	const profRaw:ProfessorInterface = {
		name: data.nome as string,
		cpf: data.cpf as string,
		registry: data.matricula as string,
		contract: data.regimeContrato as string,
		status: data.status as string,
		title: data.titulacao as string,
		code: data.codigo as string,
		id: id,
	};

	// TODO if classes throws errors, they must be inserted inside try..catch scope and treated properly
	// TODO change constructor insertings
	const prof = new Professor(profRaw);

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
