import { useEffect, useState } from "react";
import type Professor from "~/modules/professor/professor.class";
import ProfessorService from "~/modules/professor/professor.service";
import AuthService from "~/modules/user/auth.service";

// async function getList(auth, state) {
// 	const list = await ProfessorService.get(auth)

// 	state(list)
// }

export default function useProfessorList({
	initialList,
}: {
	initialList?: Professor[];
}) {
	const auth = AuthService.getUserToken();
	const [list, setList] = useState<Professor[]>(initialList ?? []);

	async function get() {
		const list = await ProfessorService.get(auth);
		setList(list);
	}

	async function search(term: string) {}

	async function deactivate(id: number) {}

	async function activate(id: number) {}

	useEffect(() => {
		if (!initialList) {
			get();
		}
	}, []);

	return { list };
}
