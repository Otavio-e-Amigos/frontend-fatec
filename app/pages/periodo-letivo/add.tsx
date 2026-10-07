import { useNavigate } from "react-router";
import FormContainer from "~/components/forms/FormContainer";
import FormInput from "~/components/forms/FormInput";
import Header from "~/layouts/Header";
import PeriodoLetivo from "~/modules/periodo-letivo/periodo-letivo.class";
import Service from "~/modules/periodo-letivo/periodo-letivo.service";
import User from "~/modules/user/user.class";
export default function AddPeriodo() {
  const navigate = useNavigate();
  return (
    <main className="flex flex-1 flex-col">
      <Header activeItem="Períodos" />
      <h1 className="text-4xl my-5 mx-2">Adicionar período letivo</h1>
      <FormContainer
        className="flex flex-col gap-4 m-5"
        onSubmit={async (event) => {
          event.preventDefault();
          const f = Object.fromEntries(new FormData(event.currentTarget));
          const auth = new User(
            JSON.parse(localStorage.getItem("auth") ?? "{}"),
          );
          if (
            await Service.save(
              new PeriodoLetivo({
                ano: Number(f.ano),
                semestre: Number(f.semestre),
                dataInicio: String(f.dataInicio),
                dataFim: String(f.dataFim),
              }),
              auth,
            )
          )
            navigate("/periodo-letivo");
        }}
      >
        <FormInput required name="ano" type="number" label="Ano" />
        <FormInput
          required
          name="semestre"
          type="select"
          label="Semestre"
          options={[
            { value: 1, label: "1º Semestre (1)" },
            { value: 2, label: "2º Semestre (2)" },
          ]}
        />
        <FormInput
          required
          name="dataInicio"
          type="date"
          label="Data inicial"
        />
        <FormInput required name="dataFim" type="date" label="Data final" />
        <button className="btn btn-success">Adicionar</button>
      </FormContainer>
    </main>
  );
}
