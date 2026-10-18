import { useEffect, useReducer, useState, type SyntheticEvent } from "react";
import { Form, useNavigate, type NavigateFunction } from "react-router";
import FormContainer from "~/components/forms/FormContainer";
import {
	FormControllerContext,
	FormDispatcherContext,
	formReducer,
	type FormReducerAction,
} from "~/components/forms/FormContext";
import FormController from "~/components/forms/FormController";

export type FormSubmitEventHandlerProps<E extends Record<string, any> = any> = {
	error?: Error;
	event: SyntheticEvent<HTMLFormElement>;
	controller: FormController;
	dispatch: React.ActionDispatch<[action: FormReducerAction]>;
	navigate: NavigateFunction;
	extras: E;
};

type FormSubmitEventHandler = (
	props: FormSubmitEventHandlerProps,
) => Promise<void> | void;

type FormContainerProps = {
	initialController?: FormController;
	children?: any;
	className?: string;
	onSubmit?: FormSubmitEventHandler;
};

type FormHookOptions = {
	initialController?: FormController;
	actions?: SubmitActionObject;
	actionsExtras?: Record<string, any>;
};

type SubmitActionObject = {
	action: FormSubmitEventHandler;
	onSuccess?: FormSubmitEventHandler;
	onFailure?: FormSubmitEventHandler;
};

export default function useForm(options?: FormHookOptions) {
	const [controller, dispatch] = useReducer(
		formReducer,
		options?.initialController || new FormController(),
	);
	const navigate = useNavigate();

	useEffect(() => {
		// console.log("controller changed!");
		// console.log(controller);
	}, [controller]);

	return {
		controller,
		controllerAction: dispatch,
		FormContainer: (props: FormContainerProps) => {
			const formProps = {
				children: props.children,
				className: props.className,
				// TODO switch this to hooks function, to eliminate the necessity of handling and other things i believe
				onSubmit: async (e: SyntheticEvent<HTMLFormElement>) => {
					const actions = options?.actions;

					const actionProps: FormSubmitEventHandlerProps = {
						event: e,
						controller,
						dispatch,
						navigate,
						extras: {}
					};

					if (options?.actionsExtras) {
						actionProps.extras = options?.actionsExtras;
					}

					try {
						// TODO think and make action() return a boolean if possible, if the operation wasn't success, it will throw an error
						// or call onFailure() directly instead
						if (actions) await actions.action(actionProps);
						if (actions?.onSuccess) await actions.onSuccess(actionProps);
					} catch (error) {
						if (actions?.onFailure)
							await actions.onFailure({
								...actionProps,
								error: error as Error,
							});
					}
				},
			};

			return (
				<FormControllerContext value={controller}>
					<FormDispatcherContext value={dispatch}>
						<Form {...formProps} />
					</FormDispatcherContext>
				</FormControllerContext>
			);
		},
	};
}
