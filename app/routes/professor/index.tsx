import Index from "~/pages/professor/index"
import type { Route } from './+types/index'
import professors from "~/mock/db/professors.db";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Appointer: Professores" },
    // { name: "description", content: "Projeto PI 3º Semestre." },
  ];
}

export async function clientLoader() {
	// const id = Number(params.id);
	// const prof = professors.find((prof) => prof.id == id);
	return { professors };
}

export default function Page() {
  return <Index list={professors} />;
}
