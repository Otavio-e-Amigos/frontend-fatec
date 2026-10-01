import Professor from "./professor.class";

export default class ProfessorService {
	static async get(): Promise<Professor[]>;
	static async get(id: number): Promise<Professor>;
	static async get(id?: number): Promise<Professor[] | Professor> {
		const prof = new Professor(
			"_name",
			"_cpf",
			"_registry",
			"_contract",
			"_status",
			"_title",
			// "_code",
			// "_id",
		);

		// get data from APIModule, whether an id is declared or not
		// 	if found by id, return Professor found by id
		// 		if no professor has been found with that id, throws NotFoundError(404, "No professor")
		// 	if no id is provided, return Professor[], no matter if is empty or not
		return prof;
	}

	static async edit(id: number, data: Professor): Promise<Professor> {
		//parse data to defined schema by API route
		// send request to API through DefaultAPIModule (apply MockAPIModule here when on development mode?)
		// if success (2xx), returns edited object with extra parameters to caller
		// if error (4xx/5xx), throws corresponding error messages
		return data;
	}

	static async save(data: Professor): Promise<Professor> {
		//parse data to defined schema by API route
		// send request to API through DefaultAPIModule (apply MockAPIModule here when on development mode?)
		// if success (2xx), returns newly created object to caller
		// if error (4xx/5xx), throws corresponding error messages
		return data;
	}

	static async delete(id: number): Promise<boolean> {
		//sends request through APIModule to delete Professor #{id}
		// if deleted, returns true
		// if not found, returns NotFoundError (or return false?)
		// if it cant be deleted by some astral reason, return false
		return true;
	}
}
