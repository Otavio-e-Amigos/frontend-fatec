import Professor from "~/modules/professor/professor.class";

// new Professor(
// 	profRaw.name,
// 	profRaw.cpf,
// 	profRaw.registry,
// 	profRaw.contract,
// 	profRaw.status,
// 	profRaw.title,
// 	profRaw.code,
// 	// profRaw.id,
// );

const professors: Professor[] = [
	new Professor(
		"Joãozinho da Silva",
		"123.456.789-01",
		"0013468270-2",
		"DETERMINADO",
		"ATIVO",
		"GRADUADO",
		"01010101",
		1
	),
	new Professor(
		"José Fagundes",
		"234.567.890-12",
		"0082649151-1",
		"DETERMINADO",
		"ATIVO",
		"GRADUADO",
		"02020202",
		2
	),
	new Professor(
		"Mariana Flores",
		"345.678.901-23",
		"0029486786-1",
		"DETERMINADO",
		"ATIVO",
		"GRADUADO",
		"03030303",
		3
	),
	new Professor(
		"Maria",
		"123.456.789-01",
		"0013468270-2",
		"DETERMINADO",
		"INATIVO",
		"DOUTORADO",
		"04040404",
		4
	),
	new Professor(
		"Paulo",
		"123.456.789-01",
		"0013468270-2",
		"DETERMINADO",
		"INATIVO",
		"DOUTORADO",
		"05050505",
		5
	)
];

export function generate() {}

// export function getRandom() {
// 	return professors.
// }

export default professors;
