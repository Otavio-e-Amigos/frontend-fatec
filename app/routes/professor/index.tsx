import Index from "~/pages/professor/index"
import type { Route } from './+types/index'

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Appointer: Professores" },
    // { name: "description", content: "Projeto PI 3º Semestre." },
  ];
}

export default function Page() {
  return <Index />;
}
