import { createContext, useState } from "react"
import User from "../user.class"

export const AuthUserContext = createContext<User>(new User({}))
export const SetAuthUserContext = createContext<React.Dispatch<React.SetStateAction<User>>>(() => {})
// export const FormDispatcherContext = createContext<any>(null)



// export default function AuthenticationService({ children }: { children: any }) {

// 	const [authUser, setAuthUser] = useState<User>(new User({}))

// 	return (
// 		<AuthUserContext value={authUser}>
// 			<SetAuthUserContext value={setAuthUser}>
// 				{children}
// 			</SetAuthUserContext>
// 		</AuthUserContext>
// 	)
// }
