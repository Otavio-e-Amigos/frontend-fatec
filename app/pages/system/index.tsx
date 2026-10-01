import { Link } from "react-router";
import Header from "~/layouts/Header";

export default function Page() {
	return (
		<div className="flex flex-1 flex-col">
			<Header />
			<main className="mt-5">
				<h1 className="text-3xl">Gerenciamento do sistema</h1>
				<section>
					<Link to={"/system/user/add"} className="link">Adicionar Usuário</Link>
				</section>
			</main>
		</div>
	)
}
