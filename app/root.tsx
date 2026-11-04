import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useNavigation,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { LoadingGeral } from "./components/loaders/LoadingGeral";
import Footer from "./layouts/Footer";
import WindowProvider from "./components/windows/WindowProvider";
import ToastProvider from "./components/toasts/ToastProvider";
import { ThemeProvider } from "./components/themes/ThemeProvider";
import { LoadingGeralWIP } from "./components/loaders/LoadingGeral.wip";

// import VLibras from "@djpfs/react-vlibras/dist/types";
export const links: Route.LinksFunction = () => [
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous",
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
	},
];

// TODO add AuthenticationServices between here or somewhere else that is enabled 24/7

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				<script src="https://vlibras.gov.br/app/vlibras-plugin.js"></script>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export async function clientLoader({}: Route.LoaderArgs) {
	return { localStorage };
}

export default function App({ loaderData }: Route.ComponentProps) {
	const navigation = useNavigation();
	console.log(loaderData);
	// const isNavigating = true;
	const isNavigating = Boolean(navigation.location);

	return (
		<ThemeProvider storage={loaderData.localStorage}>
			<ToastProvider>
				<WindowProvider>
					<Outlet />
					<Footer />
					{/*{isNavigating && <LoadingGeral mensagem="Carregando página..." />}*/}
					{isNavigating && <LoadingGeralWIP mensagem="Carregando página..." />}
				</WindowProvider>
			</ToastProvider>
		</ThemeProvider>
	);
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = "Oops!";
	let details = "An unexpected error occurred.";
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "404" : "Error";
		details =
			error.status === 404
				? "The requested page could not be found."
				: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<main className="pt-16 p-4 container mx-auto">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full p-4 overflow-x-auto">
					<code>{stack}</code>
				</pre>
			)}
		</main>
	);
}
