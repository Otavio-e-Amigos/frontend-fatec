import type { Route } from "./+types/home";
import Index from "~/pages";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Appointer" },
    { name: "description", content: "Projeto PI 3º Semestre." },
  ];
}

export default function Home() {
  return <Index />;
}
