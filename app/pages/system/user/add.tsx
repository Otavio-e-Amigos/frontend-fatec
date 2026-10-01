import { useContext, type SyntheticEvent } from "react";
import FormContainer from "~/components/forms/FormContainer";
import FormController from "~/components/forms/FormController";
import FormInput from "~/components/forms/FormInput";
import Header from "~/layouts/Header";
import FormSection from "~/layouts/forms/FormSection";
import { auth } from "~/mock/db/users.db";
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
		profile: data.profile as "TI" | "RESPONSAVEL",
	};
	// TODO if classes throws errors, they must be inserted inside try..catch scope and treated properly
	const user = new User(raw);

	try {
		// inserts edit or save method depending on method's mode
		localStorage.setItem("test", JSON.stringify(user));
		console.log("requesting save data...");

		const res =
			mode === "add"
				? await UserService.save(user, auth)
				: await UserService.edit(id!, user, auth);

		console.log(
			"looks like it saved, this is the data UserService returned:",
			res,
		);
		// redirect user to newly created professor page
		// redirect(`/professor/${res.id}`)
	} catch (e) {}
}

export default function Page({ user }: { user?: User }) {
	const controller = new FormController();

	const formMode = user ? "edit" : "add";
	// console.log(formMode)
	// const auth = useContext(AuthUserContext)
	const userAuth = auth;

	if (user) {
		controller.addField("user", user.name);
		controller.addField("pass", user.password);
	}

	const submit = (e: SyntheticEvent<HTMLFormElement>) =>
		submitData(e, formMode, controller, userAuth, user?.id);

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
						<FormInput required name={"pass"} type="text" label="Nova Senha" />
						<div className="flex flex-col">
							<label>Perfil de Usuário</label>
							<select name="profile" defaultValue={"TI"} className="form-input">
								<option value={"TI"} selected>
									TI
								</option>
								<option value={"RESPONSAVEL"}>Responsável</option>
							</select>
						</div>
					</FormSection>
					<button type="submit" className="btn btn-success">
						Adicionar
					</button>
				</FormContainer>
			</main>
		</>
	);
}
