import { useContext, useEffect, useState, type SyntheticEvent } from "react";
import { redirect, useNavigate } from "react-router";
import FormContainer from "~/components/forms/FormContainer";
import FormController from "~/components/forms/FormController";
import FormInput from "~/components/forms/FormInput";
import { LoadingGeral } from "~/components/loaders/LoadingGeral";
import { DefaultAPIModule } from "~/modules/api/modules/default/DefaultAPIModule";
import {
  AuthUserContext,
  SetAuthUserContext,
} from "~/modules/user/components/AuthenticationService";
import User, { type UserInterface } from "~/modules/user/user.class";

export default function Page() {
  const [carregandoGeral, setCarregandoGeral] = useState(false);
  const authUser = useContext(AuthUserContext);
  const setAuthUser = useContext(SetAuthUserContext);
  const navigate = useNavigate();
  const [controller, setController] = useState(new FormController());
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    user?: string;
    pass?: string;
  }>({});

  async function authenticate(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const login = String(data.user ?? "").trim();
    const senha = String(data.pass ?? "");
    const errors: { user?: string; pass?: string } = {};

    if (!login) errors.user = "Informe o usuário.";
    if (!senha) errors.pass = "Informe a senha.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setCarregandoGeral(true);
    const form = {
      login,
      senha,
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
        const apiError = res.rawData as { mensagem?: unknown } | undefined;
        setError(
          typeof apiError?.mensagem === "string"
            ? apiError.mensagem
            : "Usuário ou senha inválidos. Verifique os dados e tente novamente.",
        );
      }
    } catch (e: unknown) {
      setError("Não foi possível entrar agora. Tente novamente em instantes.");
    } finally {
      setCarregandoGeral(false);
    }
  }

  useEffect(() => {
    console.log(authUser);
  }, [authUser]);

  return (
    <div className="flex flex-1 justify-center items-center">
      {carregandoGeral && <LoadingGeral mensagem="Validando suas credenciais..." />}
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
            <FormInput
              name="user"
              type="text"
              label="Usuário"
              required
              error={fieldErrors.user}
              onChange={() =>
                setFieldErrors((current) => ({ ...current, user: undefined }))
              }
            />
            <FormInput
              name="pass"
              type="password"
              label="Senha"
              required
              error={fieldErrors.pass}
              onChange={() =>
                setFieldErrors((current) => ({ ...current, pass: undefined }))
              }
            />
            {error && <p className="text-rose-500" role="alert">{error}</p>}
            <button
              className="btn btn-success"
              type="submit"
              disabled={carregandoGeral}
              aria-busy={carregandoGeral}
            >
              {carregandoGeral ? "Entrando..." : "Entrar"}
            </button>
          </FormContainer>
        </section>
      </main>
    </div>
  );
}
