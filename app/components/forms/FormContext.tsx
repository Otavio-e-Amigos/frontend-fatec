import { createContext, useReducer, useState } from "react";
import FormController, {
	InputValidator,
	type FormError,
} from "~/components/forms/FormController";

export const FormControllerContext = createContext<FormController | null>(null);
export const FormDispatcherContext = createContext<
	React.ActionDispatch<[action: FormReducerAction]> | undefined
>(undefined);

export type FormReducerAction = {
	action:
		| "addField"
		| "editField"
		| "deleteField"
		| "setFieldError"
		| "setError"
		| "cleanFieldError";
	fieldName?: string;
	value?: any;
	validator?: InputValidator;
	error?: FormError;
};

export function formReducer(
	controller: FormController,
	action: FormReducerAction,
) {
	// object is created everytime the reducer is called, is this okay for resource usage or there is an efficient way of managing that?
	const newController: FormController = Object.assign(
		Object.create(Object.getPrototypeOf(controller)),
		controller,
	);

	switch (action.action) {
		case "addField": {
			// console.log("adding field! (sorry for the spam btw)")
			newController.addField(action.fieldName!, action.value, {
				validator: action.validator,
				error: action.error,
			});
			break;
		}

		case "setFieldError": {
			console.log("applying field error!");
			// console.log("before", newController);
			console.log(action);
			newController.setFieldError(action.fieldName as string, action.error);
			console.log("after", newController);
			break;
		}

		case "cleanFieldError": {
			// console.log("cleaning error!")
			newController.cleanFieldError(action.fieldName!);
			break;
		}

		case "setError": {
			console.log("applying main error!");
			newController.setError(action.error);
			console.log(newController);
			break;
		}

		// case "editField": {
		// 	newController.editField(action.fieldName, action.value);
		// 	break;
		// }

		// case "deleteField": {
		// 	newController.deleteField(action.fieldName);
		// 	break;
		// }

		// default: {}
	}

	return newController;
}
