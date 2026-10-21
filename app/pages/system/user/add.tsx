import { useState } from "react";
import FormInput from "~/components/forms/FormInput";
import useForm from "~/hooks/useForm";
import Header from "~/layouts/Header";
import FormSection from "~/layouts/forms/FormSection";
import saveUser from "~/modules/user/@actions/save.action";
import type User from "~/modules/user/user.class";
import SaveUserForm from "../@layouts/SaveUsuarioForm";

/** Renders the system user form and displays submission failures. */
export default function Page({ user }: { user?: User }) {
	return (
		<>
			<Header />
			<main className="mx-5 mt-5">
				<SaveUserForm user={user} />
			</main>
		</>
	);
}
