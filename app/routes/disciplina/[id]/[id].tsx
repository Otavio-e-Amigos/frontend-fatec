import { Link } from "react-router";
import type { Route } from "./+types/[id]";
import About from "~/pages/disciplina/[id]";

// import professors from "~/mock/db/professors.db";
import DisciplinaService from "~/modules/disciplina/disciplina.service";
import User from "~/modules/user/user.class";

export async function clientLoader({ params }: Route.LoaderArgs) {
    const id = Number(params.id);
    const auth = new User(JSON.parse(localStorage.getItem("auth") as string))
    const disciplina = await DisciplinaService.get(id, auth);
    // const prof = professors.find((prof) => prof.id == id);
    return { disciplina };
}

export default function Page({ loaderData }: Route.ComponentProps) {
    if (!loaderData.disciplina) {
        return <p>Insert Not Found Page here</p>
    }
    return (
        <About disciplina={loaderData.disciplina} />
    );
}
