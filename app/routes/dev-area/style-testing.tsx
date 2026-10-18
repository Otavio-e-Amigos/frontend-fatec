import Style from "~/pages/dev-area/style-testing"
import type { Route } from './+types/index'

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Appointer: dev area" },
    // { name: "description", content: "Projeto PI 3º Semestre." },
  ];
}

export default function Page() {
  return <Style />;
}
