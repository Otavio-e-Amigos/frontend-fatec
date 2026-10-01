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

	constructor(init: UserInterface) {
		this.id = init.id;
		this.name = init.name;
		this.login = init.login;
		this.token = init.token;
		this.password = init.password;
		this.profile = init.profile;
		this.active = init.active;
		this.createdAt = init.createdAt;
		this.updatedAt = init.updatedAt;
	}
}
