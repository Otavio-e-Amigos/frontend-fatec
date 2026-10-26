import { useContext, useEffect, useState, type ReactNode } from "react";
import { createContext } from "react";
import { useRevalidator } from "react-router";

export type WindowHookOptions = {
	wrapper?: any;
	initialData?: WindowAPI;
	extras?: any;
};

/** Gerenciador de janelas, utilizado para definir layouts e outras opções importantes do sistema */
export type WindowManagerAPI = {
	/** Função que define um wrapper para o conteúdo de uma janela  */
	setWrapper: any;
	setData: any;
	setInitialData: any;
	setExtras: any;

	// show(): (() => void) | (() => boolean);
	show: any;

	hide: any;
};

/** Interface de dados para criação e disposição de dados para janelas */
export type WindowAPI = {
	title?: string;

	/** Texto simples para descrever sobre algum evento ocorrendo dentro do sistema. */
	description?: string;

	/** Caso o conteúdo da janela seja complexo, precisa a utilização desta propriedade. */
	body?: ReactNode;

	/** Tipo de "Atenção" sobre a mensagem á ser passada (alerta, inforamtiva, etc) */
	tone?: string;

	/** Ações que uma janela possa oferecer ao usuário. Potencialmente reciclável entre módulos */
	actions?: ReactNode;

	/** Quando definido para `false`, obriga o usuário realizar uma ação imposta pela janela. */
	dismissible?: boolean;

	/** POSSIVELMENTE DESCARTAVEL, SUBSTITUIDO POR `actions` */
	// onAction?: () => void;

	/** Campo livre para dados específicos das janelas, qualquer tipo de dado pode ser inserido aqui. */
	extras?: any;

	manager?: any;

	hide?: any;
	show?: any;
};

export const WindowContext = createContext<WindowManagerAPI | undefined>(
	undefined,
);

export default function useWindow(options?: WindowHookOptions) {
	const context = useContext(WindowContext);
	// const { revalidate } = useRevalidator();
	if (!context) {
		throw new Error("useWindow deve ser usado dentro de <DialogProvider>.");
	}

	// Dados contidos dentro da hook são removidas toda vez que esta hook é chamada, indicando que o usuário está em outra página.
	// useEffect(() => {
		// context.setData(undefined);
		// console.log("called!", options?.initialData)
	// }, [options])

	if (options?.wrapper) context.setWrapper(options.wrapper);
	if (options?.initialData) {
		context.setInitialData(undefined)
		context.setData(options.initialData)
	};
	if (options?.extras) {
		context.setExtras(undefined)
		context.setExtras(options.extras)
	};
	// if (options?.initialData) context.setWrapper(options.initialData)
	// if (options?.wrapper) context.setWrapper(options.wrapper)
	return context;
}
