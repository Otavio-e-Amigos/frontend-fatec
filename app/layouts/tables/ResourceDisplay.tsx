import { Link } from "react-router";

export default function ProfessorNameDisplay({
	id,
	name,
	baseURL,
}: {
	id: number | string;
	name: string;
	baseURL: string;
}) {
	return (
		<Link key={id} className="link" to={`${baseURL}/${id}`}>
			{name}
		</Link>
	);
}
