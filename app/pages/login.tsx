// import { AxiosError } from "axios";
// import { useContext, useEffect, useState, type SyntheticEvent } from "react";
// import { useNavigate } from "react-router";
// import FormContainer from "~/components/forms/FormContainer";
// import { FormControllerContext } from "~/components/forms/FormContext";
// import FormController from "~/components/forms/FormController";
import FormInput from "~/components/forms/FormInput";
import useForm from "~/hooks/useForm";
import login from "~/modules/user/@actions/login.action";
// import {
// 	AuthUserContext,
// 	SetAuthUserContext,
// } from "~/modules/user/@components/AuthenticationService";
// import User, { type UserInterface } from "~/modules/user/user.class";

export default function Page() {
	const { controller, controllerAction, FormContainer } = useForm({actions: login})

	// const submit = async (e: SyntheticEvent<HTMLFormElement>, controller:any, dispatch:any) => {
	// 	const res = await login(e, controller, dispatch);
	// 	if (res) {
	// 		// console.log("entering to /")
	// 		navigate("/");
	// 	}
	// };

	return (
		<div className="flex flex-1 justify-center items-center">
			<main className="flex flex-col border p-5 w-100 gap-10 border-surface-outline bg-surface">
				<div>
					<h1 className="text-4xl">Login</h1>
					<h5 className="text-sm text-gray-500">
						Seja bem-vindo ao Appointer!
					</h5>
				</div>
				<section>
					<FormContainer
						className="flex flex-col gap-4"
					>
						<FormInput required hideRequiredLabel name={"user"} type="text" label="Usuário" />
						<FormInput required hideRequiredLabel name={"pass"} type="password" label="Senha" />
						<p className="text-rose-500">
							{controller?.error?.message && controller.error.message}
						</p>
						<button type="submit" className="btn btn-success">Entrar</button>
					</FormContainer>
				</section>
			</main>
		</div>
	);
}

// async function authenticate(event: SyntheticEvent<HTMLFormElement>) {
// event.preventDefault();

// await login(event)
// return

// const data = Object.fromEntries(new FormData(event.currentTarget));
// console.log(data);
// const form = {
// 	login: data.user,
// 	senha: data.pass,
// };

// const module = new DefaultAPIModule();

// try {
// 	const res = await module.request({
// 		method: "POST",
// 		path: ["autenticacao", "login"],
// 		body: form,
// 	});

// 	if (res.ok) {
// console.log("you are now logged in!");
// console.log("This is the data that returned from APIModule");
// console.log(res);
// const init: UserInterface = {
// 	id: res.rawData.dados?.id,
// 	name: res.rawData.dados?.nome,
// 	profile: res.rawData.dados?.perfil,
// 	token: res.rawData.dados?.token,
// };
// const user = new User(init);
// console.log("user created!");
// console.log(user);
// localStorage.setItem("auth", JSON.stringify(user));
// navigate("/");
// 	} else {
// 		console.log(
// 			"Something happened while logging, could you check the net log?",
// 		);
// 		console.log("This is the data that returned from APIModule");
// 		console.log(res);
// 		controller.setError({ message: res.rawData.mensagem });
// 		setError(res.rawData.mensagem);
// 	}
// } catch (e: any) {
// 	console.log("error?")
// 	console.log(e)
// 	// if (e instanceof AxiosError) {
// 	// 	console.log(e.response);
// 	// 	console.log("e.response");
// 	// 	controller.setError({ message: e.response?.data.mensagem });
// 	// 	setError(e.response?.data.mensagem);
// 	// }
// }
// }

// useEffect(() => {
// 	console.log(authUser);
// }, [authUser]);
