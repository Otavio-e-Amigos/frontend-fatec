import { AxiosError } from "axios";
import { useContext, useEffect, useState, type SyntheticEvent } from "react";
import { redirect, useNavigate } from "react-router";
import FormContainer from "~/components/forms/FormContainer";
import FormController from "~/components/forms/FormController";
import FormInput from "~/components/forms/FormInput";
import { DefaultAPIModule } from "~/modules/api/modules/default/DefaultAPIModule";
import {
	AuthUserContext,
	SetAuthUserContext,
} from "~/modules/user/components/AuthenticationService";
import User, { type UserInterface } from "~/modules/user/user.class";

export default function Page() {
	const authUser = useContext(AuthUserContext);
	const setAuthUser = useContext(SetAuthUserContext);
	const navigate = useNavigate();
	const [controller, setController] = useState(new FormController());
	const [error, setError] = useState("");

	async function authenticate(event: SyntheticEvent<HTMLFormElement>) {
		event.preventDefault();
		const data = Object.fromEntries(new FormData(event.currentTarget));
		console.log(data);
		const form = {
			login: data.user,
			senha: data.pass,
		};

		const module = new DefaultAPIModule();

		try {
			const res = await module.request({
				method: "POST",
				path: ["autenticacao", "login"],
				body: form,
			});

			if (res.ok) {
				console.log("you are now logged in!");
				console.log("This is the data that returned from APIModule");
				console.log(res);
				const init: UserInterface = {
					id: res.rawData.dados?.id,
					name: res.rawData.dados?.nome,
					profile: res.rawData.dados?.perfil,
					token: res.rawData.dados?.token,
				};
				const user = new User(init);
				console.log("user created!");
				console.log(user);
				localStorage.setItem("auth", JSON.stringify(user));
				navigate("/");
			} else {
				console.log(
					"Something happened while logging, could you check the net log?",
				);
				console.log("This is the data that returned from APIModule");
				console.log(res);
			}
		} catch (e: unknown) {
			if (e instanceof AxiosError) {
				console.log(e.response);
				controller.setError({ message: e.response?.data.mensagem });
				setError(e.response?.data.mensagem)
			}
		}
	}

	useEffect(() => {
		console.log(authUser);
	}, [authUser]);

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
						onSubmit={authenticate}
						initialController={controller}
					>
						<FormInput name={"user"} type="text" label="Usuário" />
						<FormInput name={"pass"} type="text" label="Senha" />
						<p className="text-rose-500">{error}</p>
						<button className="btn btn-success">Entrar</button>
					</FormContainer>
				</section>
			</main>
		</div>
	);
}
