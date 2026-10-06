import Page from "~/pages/disciplina/add"
import type { Route } from "./+types/add";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Appointer: Adicionar Disciplina" },
    // { name: "description", content: "Projeto PI 3º Semestre." },
  ];
}

export default function Add() {
	return (
		<Page/>
  )
}
