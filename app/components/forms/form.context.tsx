import { createContext, useReducer, useState } from "react"
import FormController, { InputValidator, type FormError } from "~/components/forms/FormController"

export const FormControllerContext = createContext<FormController | null>(null)
export const FormDispatcherContext = createContext<any>(null)

// export function FormControllerReducer(initialController? : FormController): [controller: FormController, dispacthAction: React.ActionDispatch<[action: FormReducerAction]>] {
//     const [controller, dispatch] = useReducer(formReducer, initialController ?? new FormController())
//     return [controller, dispatch]
// }

type FormReducerAction = {
    action: "addField" | "editField" | "deleteField" | "setFieldError" | "cleanFieldError",
    fieldName: string,
    value?: any,
    validator?: InputValidator,
    error?: FormError
}

export function formReducer(controller:FormController, action:FormReducerAction) {
    // object is created everytime the reducer is called, is this okay for resource usage or there is an efficient way of managing that?
    const newController = Object.assign(Object.create(Object.getPrototypeOf(controller)), controller)

    switch (action.action) {
        case 'addField': {
            console.log("hello from context!")
            newController.addField(action.fieldName, action.value, {validator: action.validator, error: action.error})
            break
        }

        case 'setFieldError': {
            console.log("applying error!")
            newController.setFieldError(action.fieldName, action.error)
            break
        }

        case 'cleanFieldError': {
            console.log("cleaning error!")
            newController.cleanFieldError(action.fieldName)
            break
        }
    }

    console.log(controller)
    return newController
}

// export default FormContext
