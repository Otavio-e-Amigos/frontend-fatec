import FormDialog from "~/components/dialogs/FormDialog";
import SaveCursoForm from "~/pages/curso/@layouts/SaveCursoForm";
import SaveDisciplinaForm from "~/pages/disciplina/@layouts/SaveDisciplinaForm";
import SavePeriodoForm from "~/pages/periodo-letivo/@layouts/SavePeriodoForm";
import SaveProfessorForm from "~/pages/professor/@layouts/SaveProfessorForm";
import type { FolhaPontoState } from "../@hooks/useFolhaPonto";

// o que a grade NÃO traz, para o usuário conferir
const AVISO = {
	professor: "Titulação e código não constam na grade: confira esses campos antes de salvar.",
	periodo: "A grade não traz as datas do período letivo (só a validade da grade). Informe as datas.",
	curso: "A sigla é só uma sugestão feita a partir do nome. Confira antes de salvar.",
	disciplina: "Código e sigla não constam na grade. Informe-os para cadastrar.",
};

export default function FolhaPontoCadastroDialog({ state }: { state: FolhaPontoState }) {
	const { cadastro, fecharCadastro, cadastroSalvo } = state;
	if (!cadastro) return null;

	return (
		<FormDialog onClose={fecharCadastro}>
			<p className="mb-2 rounded-lg bg-surface p-3 text-xs text-ink-muted">
				{AVISO[cadastro.tipo]}
			</p>
			{cadastro.tipo === "professor" && (
				<SaveProfessorForm initialValues={cadastro.valores} onSaved={cadastroSalvo} />
			)}
			{cadastro.tipo === "periodo" && (
				<SavePeriodoForm initialValues={cadastro.valores} onSaved={cadastroSalvo} />
			)}
			{cadastro.tipo === "curso" && (
				<SaveCursoForm initialValues={cadastro.valores} onSaved={cadastroSalvo} />
			)}
			{cadastro.tipo === "disciplina" && (
				<SaveDisciplinaForm initialValues={cadastro.valores} onSaved={cadastroSalvo} />
			)}
		</FormDialog>
	);
}