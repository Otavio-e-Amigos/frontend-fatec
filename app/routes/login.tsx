import Page from "~/pages/login";
import loginStyles from "~/styles/login.css?url";

export function links() {
	return [
		{ rel: "stylesheet", href: loginStyles },
		{
			rel: "stylesheet",
			href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap",
		},
	];
}

export default function Login() {
	return <Page />;
}
