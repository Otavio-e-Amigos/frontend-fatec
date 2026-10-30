import type { ReactNode } from "react";

export type WindowAPIConstructor = Omit<WindowAPI, "show" | "hide">;

export type WindowAPI = {
	/** Título da janela */
	title?: string;

	/** Texto simples para descrever sobre algum evento ocorrendo dentro do sistema. */
	description?: string;

	/** Conteúdo dinâmico da janela */
	body?: ReactNode;

	/** Tipo de Atenção sobre a mensagem á ser passada (alerta, inforamtiva, etc) */
	tone?: string;

	/** Ações que uma janela possa oferecer ao usuário. */
	actions?: ReactNode;

	/** Quando definido para `false`, obriga o usuário realizar uma ação imposta pela janela. */
	dismissible?: boolean;

	/** Campo livre para dados específicos entres janelas e seu corpo, qualquer tipo de dado pode ser inserido aqui. */
	extras?: any;

	// manager?: any;

	show: (data?: WindowAPI, wrapper?: any) => void;
	hide: () => void;
};

/** Interface para sistema gerenciador de janelas, utilizado para definir layouts e outras opções importantes do sistema dentro do código */
export type WindowManagerAPI = {
	/** Função que define um wrapper para o conteúdo de uma janela  */
	setWrapper: any;
	setData: any;
	setInitialData: any;
	setExtras: any;

	/* As mesmas funções também são compartilhadas para a própria janela em si */
	show: (data?: WindowAPIConstructor, wrapper?: any) => void;
	hide: () => void;
};

export type WindowHookOptions = {
	wrapper?: any;
	initialData?: WindowAPIConstructor;
	extras?: any;
};
