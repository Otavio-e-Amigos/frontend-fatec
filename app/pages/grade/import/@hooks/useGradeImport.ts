import { useMemo, useState } from "react";
import { useRevalidator } from "react-router";
import getErrorMessage from "~/classes/errors/get-error-message";
import {
	emptyDiscipline,
	emptyLesson,
} from "~/modules/grade/extraction/api/grade-extraction.mapper";
import {
	courseKey,
	suggestAcronym,
	type GradeRegistry,
} from "~/modules/grade/extraction/grade-extraction.registry";
import { saveExtractedGrade } from "~/modules/grade/extraction/grade-extraction.save";
import GradeExtractionService from "~/modules/grade/extraction/grade-extraction.service";
import {
	emptyExtras,
	type ExtractedDiscipline,
	type ExtractedGrade,
	type ExtractedHours,
	type ExtractedLesson,
	type ExtractedProfessor,
	type GradeImportExtras,
	type ImportedGradeResult,
} from "~/modules/grade/extraction/grade-extraction.types";
import {
	hasErrors,
	validateGradeImport,
} from "~/modules/grade/extraction/grade-extraction.validation";
import AuthService from "~/modules/user/auth.service";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // same limit as the API

type ExtraGroup = "courseAcronyms" | "disciplineCodes" | "disciplineAcronyms";

/** Controls the PDF upload, the review forms and the grade saving. */
export default function useGradeImport(registry: GradeRegistry) {
	const { revalidate } = useRevalidator();

	const [file, setFile] = useState<File | null>(null);
	const [data, setData] = useState<ExtractedGrade | null>(null);
	const [extras, setExtras] = useState<GradeImportExtras>(emptyExtras());
	const [isExtracting, setIsExtracting] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState("");
	const [result, setResult] = useState<ImportedGradeResult | null>(null);

	const errors = useMemo(
		() => (data ? validateGradeImport(data, extras, registry) : null),
		[data, extras, registry],
	);

	function selectFile(selected: File | null) {
		setError("");
		if (!selected) return setFile(null);
		const isPdf =
			selected.type === "application/pdf" ||
			selected.name.toLowerCase().endsWith(".pdf");
		if (!isPdf) {
			setFile(null);
			return setError("Formato inválido: envie um arquivo PDF.");
		}
		if (selected.size > MAX_FILE_SIZE) {
			setFile(null);
			return setError("O arquivo excede o tamanho máximo de 10 MB.");
		}
		setFile(selected);
	}

	async function extract() {
		if (!file) return;
		setError("");
		setIsExtracting(true);
		try {
			const extracted = await GradeExtractionService.extract(
				file,
				AuthService.getUserToken(),
			);
			setData(extracted);
			setExtras({
				...emptyExtras(),
				// acronym suggestions, editable in the form
				courseAcronyms: Object.fromEntries(
					extracted.disciplinas
						.filter((item) => item.curso.trim() && item.periodo)
						.map((item) => [
							courseKey(item.curso, item.periodo),
							suggestAcronym(item.curso),
						]),
				),
			});
		} catch (e) {
			setError(getErrorMessage(e, "Não foi possível extrair os dados do arquivo."));
		} finally {
			setIsExtracting(false);
		}
	}

	async function save() {
		if (!data || !errors || isSaving) return;
		setError("");
		if (hasErrors(errors)) {
			return setError("Corrija os campos destacados antes de salvar a grade.");
		}
		setIsSaving(true);
		try {
			setResult(await saveExtractedGrade(data, extras, AuthService.getUserToken()));
		} catch (e) {
			setError(getErrorMessage(e, "Não foi possível salvar a grade. Tente novamente."));
		} finally {
			setIsSaving(false);
			// refreshes the "already registered" panel, also after partial saves
			revalidate();
		}
	}

	function reset() {
		setData(null);
		setFile(null);
		setError("");
		setExtras(emptyExtras());
	}

	// --- form editing (immutable) ---
	const update = (patch: Partial<ExtractedGrade>) =>
		setData((current) => current && { ...current, ...patch });
	const updateProfessor = (patch: Partial<ExtractedProfessor>) =>
		setData((current) => current && { ...current, professor: { ...current.professor, ...patch } });
	const updateHours = (patch: Partial<ExtractedHours>) =>
		setData((current) => current && { ...current, horas: { ...current.horas, ...patch } });

	const updateDiscipline = (index: number, patch: Partial<ExtractedDiscipline>) =>
		setData(
			(current) =>
				current && {
					...current,
					disciplinas: current.disciplinas.map((item, i) =>
						i === index ? { ...item, ...patch } : item,
					),
				},
		);
	const addDiscipline = () =>
		setData((current) => current && { ...current, disciplinas: [...current.disciplinas, emptyDiscipline()] });
	const removeDiscipline = (index: number) =>
		setData((current) => current && { ...current, disciplinas: current.disciplinas.filter((_, i) => i !== index) });

	const updateLesson = (index: number, lessonIndex: number, patch: Partial<ExtractedLesson>) =>
		setData(
			(current) =>
				current && {
					...current,
					disciplinas: current.disciplinas.map((item, i) =>
						i !== index
							? item
							: {
									...item,
									aulas: item.aulas.map((lesson, n) =>
										n === lessonIndex ? { ...lesson, ...patch } : lesson,
									),
								},
					),
				},
		);
	const addLesson = (index: number) =>
		setData(
			(current) =>
				current && {
					...current,
					disciplinas: current.disciplinas.map((item, i) =>
						i === index ? { ...item, aulas: [...item.aulas, emptyLesson()] } : item,
					),
				},
		);
	const removeLesson = (index: number, lessonIndex: number) =>
		setData(
			(current) =>
				current && {
					...current,
					disciplinas: current.disciplinas.map((item, i) =>
						i === index
							? { ...item, aulas: item.aulas.filter((_, n) => n !== lessonIndex) }
							: item,
					),
				},
		);

	// --- complementary data (what the PDF does not carry) ---
	const updateExtras = (patch: Partial<GradeImportExtras>) =>
		setExtras((current) => ({ ...current, ...patch }));
	const updateExtraEntry = (group: ExtraGroup, key: string, value: string) =>
		setExtras((current) => ({ ...current, [group]: { ...current[group], [key]: value } }));

	return {
		registry, file, data, extras, errors, error, result, isExtracting, isSaving,
		selectFile, extract, save, reset,
		update, updateProfessor, updateHours,
		updateDiscipline, addDiscipline, removeDiscipline,
		updateLesson, addLesson, removeLesson,
		updateExtras, updateExtraEntry,
	};
}

export type GradeImportState = ReturnType<typeof useGradeImport>;