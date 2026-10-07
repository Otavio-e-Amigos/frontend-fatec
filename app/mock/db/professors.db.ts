import Professor from "~/modules/professor/professor.class";

const professors: Professor[] = [
	new Professor({
		name: "Joãozinho da Silva",
		cpf: "123.456.789-01",
		registry: "0013468270-2",
		contract: "DETERMINADO",
		status: "ATIVO",
		title: "GRADUADO",
		code: "01010101",
		id: 1,
	}),
	new Professor({
		name: "José Fagundes",
		cpf: "234.567.890-12",
		registry: "0082649151-1",
		contract: "DETERMINADO",
		status: "ATIVO",
		title: "GRADUADO",
		code: "02020202",
		id: 2,
	}),
	new Professor({
		name: "Mariana Flores",
		cpf: "345.678.901-23",
		registry: "0029486786-1",
		contract: "DETERMINADO",
		status: "ATIVO",
		title: "GRADUADO",
		code: "03030303",
		id: 3,
	}),
	new Professor({
		name: "Maria",
		cpf: "123.456.789-01",
		registry: "0013468270-2",
		contract: "DETERMINADO",
		status: "INATIVO",
		title: "DOUTORADO",
		code: "04040404",
		id: 4,
	}),
	new Professor({
		name: "Paulo",
		cpf: "123.456.789-01",
		registry: "0013468270-2",
		contract: "DETERMINADO",
		status: "INATIVO",
		title: "DOUTORADO",
		code: "05050505",
		id: 5,
	}),
];

export default professors;
