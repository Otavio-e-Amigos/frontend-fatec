import User from "../user.class";

export default function mapper(data: any) {
	return new User({
		id: data.id,
		name: data.nome,
		login: data.login,
		profile: data.perfil,
		active: data.ativo,
		createdAt: data.createdAt,
		updatedAt: data.updatedAt,
	});
}
