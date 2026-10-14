export interface UserInterface {
	id?: number;
	name?: string;
	login?: string;
	token?: string;
	password?: string;
	profile?: "TI" | "RESPONSAVEL";
	active?: boolean;
	createdAt?: string; //Date
	updatedAt?: string; //Date
}

export default class User implements UserInterface {
	id?: number;
	name?: string;
	login?: string;
	password?: string;
	token?: string;
	profile?: "TI" | "RESPONSAVEL";
	active?: boolean;
	createdAt?: string;
	updatedAt?: string;

	constructor(data: UserInterface) {
		Object.assign(this, data);
	}
}
