import Page from "~/pages/professor/[id]/edit";
import type { Route } from "./+types/edit";
// import professors from "~/mock/db/professors.db";
import ProfessorService from "~/modules/professor/professor.service";
import AuthService from "~/modules/user/auth.service";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Appointer: Editar Professor" },
    // { name: "description", content: "Projeto PI 3º Semestre." },
  ];
}

export async function clientLoader({ params }: Route.LoaderArgs) {
  const id = Number(params.id);
  const auth = AuthService.getUserToken();
  const prof = await ProfessorService.get(id, auth);
  return { prof };
}

export default function Edit({ loaderData }: Route.ComponentProps) {
  if (!loaderData.prof) {
    return <p>Professor not found. Insert default not found page here</p>;
  }
  return <Page professor={loaderData.prof} />;
}
