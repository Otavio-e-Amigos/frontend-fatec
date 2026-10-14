import { createContext, useState } from "react"
import User from "../user.class"

export const AuthUserContext = createContext<User>(new User({}))
export const SetAuthUserContext = createContext<React.Dispatch<React.SetStateAction<User>>>(() => {})
