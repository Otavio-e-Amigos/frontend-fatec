import { createContext } from "react"
import FormController from "~/pages/professor/FormController"

const FormContext = createContext(new FormController())

export default FormContext
