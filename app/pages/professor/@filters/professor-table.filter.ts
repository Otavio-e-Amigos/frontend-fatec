import type Professor from "~/modules/professor/professor.class";

export default function filter(prof: Professor, term: string) {
	return [prof.name, prof.registry].some((value) =>
		value ? value.toLowerCase().includes(term) : false,
	);
}
