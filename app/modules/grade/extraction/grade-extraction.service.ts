import type AbstractQueryObject from "../../api/base/AbstractQueryObject";
import DefaultAPIData from "../../api/modules/default/DefaultAPIData";
import { DefaultAPIModule } from "../../api/modules/default/DefaultAPIModule";
import type User from "../../user/user.class";
import gradeExtractionRoutes from "./api/grade-extraction.routes";
import { fromApi, toApi } from "./api/grade-extraction.mapper";
import type { ExtractedGrade } from "./grade-extraction.types";

export default class GradeExtractionService {
	static module = new DefaultAPIModule();

	private static async request(
		request: AbstractQueryObject,
		auth: User,
	): Promise<DefaultAPIData> {
		try {
			return await this.module.request({ ...request, credentials: auth });
		} catch (error) {
			if (error instanceof DefaultAPIData) {
				const message = error.rawData?.mensagem;
				if (typeof message === "string" && message.trim()) {
					throw new Error(message);
				}
			}
			throw error;
		}
	}

	/** Sends the grade PDF and returns the extracted data (with warnings). */
	static async extract(file: File, auth: User): Promise<ExtractedGrade> {
		const body = new FormData();
		body.append("arquivo", file); // field name expected by the API
		const response = await this.request(
			{ ...gradeExtractionRoutes.EXTRACT, body, timeout: 90_000 },
			auth,
		);
		return fromApi(response.rawData?.dados);
	}

	/** The API revalidates and normalizes the corrected data. Throws Error(message) on 400. */
	static async validate(data: ExtractedGrade, auth: User): Promise<ExtractedGrade> {
		const response = await this.request(
			{ ...gradeExtractionRoutes.VALIDATE, body: toApi(data) },
			auth,
		);
		return fromApi(response.rawData?.dados);
	}
}