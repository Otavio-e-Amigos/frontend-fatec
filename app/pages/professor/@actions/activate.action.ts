import { useRevalidator } from "react-router";
import useDialogs from "~/hooks/useDialogs";
import ProfessorService from "~/modules/professor/professor.service";
import AuthService from "~/modules/user/auth.service";
import getErrorMessage from "~/classes/errors/get-error-message";
import type Professor from "~/modules/professor/professor.class";


// export default async function activate(prof: Professor, system: any) {
// 	// const dialogs = useDialogs()
// 	// const auth = AuthService.getUserToken();
// 	// const { revalidate } = useRevalidator();

// 	try {
// 		const res = await ProfessorService.activate(prof.id!, system.auth);
// 		if (!res) throw new Error();
// 		system.dialogs.toast.success(`${prof.name} foi ativado.`);
// 		system.revalidate();
// 	} catch (error) {
// 		system.dialogs.toast.error(
// 			getErrorMessage(error, "Não foi possível ativar o professor."),
// 		);
// 	}
// }
