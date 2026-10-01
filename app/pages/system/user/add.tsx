import { useContext, type SyntheticEvent } from "react";
import FormContainer from "~/components/forms/FormContainer";
import FormController from "~/components/forms/FormController";
import FormInput from "~/components/forms/FormInput";
import Header from "~/layouts/Header";
import FormSection from "~/layouts/forms/FormSection";
import { AuthUserContext } from "~/modules/user/components/AuthenticationService";
import User, { type UserInterface } from "~/modules/user/user.class";
import UserService from "~/modules/user/user.service";

async function submitData(
	event: SyntheticEvent<HTMLFormElement>,
	mode: "add" | "edit",
	controller: FormController,
	auth: User,
	id?: number,
) {
	event.preventDefault();
	const data = Object.fromEntries(new FormData(event.currentTarget));
	console.log("data from form: ", data);

	const raw: UserInterface = {
		id: id,
		name: data.user as string,
		password: data.pass as string,
		profile: data.profile as "TI" | "RESPONSAVEL"
	}
	// TODO if classes throws errors, they must be inserted inside try..catch scope and treated properly
	const user = new User(raw)
	// console.log("prof", prof);

	try {
		// inserts edit or save method depending on method's mode
		console.log("requesting save data...")
		const res =
			mode === "add"
				? await UserService.save(user, auth)
				: await UserService.edit(id!, user);

		console.log(
			"looks like it saved, this is the data UserService returned:",
			res,
		);
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

export default function Page({ user }: { user?: any }) {
	const controller = new FormController();

	const formMode = user ? "edit" : "add";
	// console.log(formMode)
	const auth = useContext(AuthUserContext)

	if (user) {
		controller.addField("user", "Username");
		controller.addField("user", "password");
	}

	const submit = (e: SyntheticEvent<HTMLFormElement>) =>
		submitData(e, formMode, controller, auth, user?.id);

	return (
		<>
			<Header />
			<main className="mt-5 mx-10">
				<h1 className="text-3xl mb-5">Adicionar Usuário</h1>
				<FormContainer
					initialController={controller}
					className="flex flex-1 flex-col gap-2"
					onSubmit={submit}
				>
					<FormSection
						section={"Informações Básicas"}
						description={"Informações do usuário á ser adicionado ao sistema"}
					>
						<FormInput required name={"user"} type="text" label="Usuário" />
						<FormInput required name={"pass"} type="text" label="Senha" />
					</FormSection>
					<button type="submit" className="btn btn-success">
						Adicionar
					</button>
				</FormContainer>
			</main>
		</>
	);
}
