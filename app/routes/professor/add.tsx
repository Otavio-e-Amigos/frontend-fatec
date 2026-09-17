import Page from "~/pages/professor/add"
import type { Route } from "./+types/add";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Appointer: Adicionar Professor" },
    // { name: "description", content: "Projeto PI 3º Semestre." },
  ];
}

export default function Add() {
	return (
		<Page />
  )
}
