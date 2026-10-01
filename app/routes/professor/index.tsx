import Index from "~/pages/professor/index";
import ProfessorService from "~/modules/professor/professor.service";
// import { auth } from "~/mock/db/users.db";
import { useEffect, useState } from "react";
import User from "~/modules/user/user.class";

export function meta() {
	return [{ title: "Appointer: Professores" }];
}

export default function Page() {
	const [professors, setProfessors] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const auth = new User(JSON.parse(localStorage.getItem("auth") as string))

	useEffect(() => {
		let active = true;

		ProfessorService.get(auth)
			.then((data) => {
				console.log("PROFESSORES DA API:", data);

				if (!active) return;

				// O service original não lança erro: em falha ele retorna undefined
				if (Array.isArray(data)) {
					setProfessors(data);
				} else {
					setError("Não foi possível carregar os professores.");
				}
			})
			.catch((e) => {
				console.error("Erro ao buscar professores:", e);
				if (active) setError(e.message ?? "Erro desconhecido");
			})
			.finally(() => {
				if (active) setLoading(false);
			});

		return () => {
			active = false;
		};
	}, []);

	if (loading) return <p>Carregando professores...</p>;
	if (error) return <p>Erro: {error}</p>;

	return <Index list={professors} />;
}
