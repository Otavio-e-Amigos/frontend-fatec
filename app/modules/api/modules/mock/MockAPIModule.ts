import AbstractAPIData, {
	type AbstractAPIDataInit,
} from "../../base/AbstractAPIData";
import AbstractAPIModule from "../../base/AbstractAPIModule";
import type AbstractQueryObject from "../../base/AbstractQueryObject";
import MockAPIData, { type MockAPIDataInit } from "./MockAPIData";
import type MockQueryObject from "./MockQueryObject";

/**
 * API Module which mimics requests and simulate results for testing environments
 */
export class MockAPIModule extends AbstractAPIModule {
	constructor() {
		super("dummyurl");
	}

	/**
	 * Creates an fake request for simulating environments and behaviors. You can set parameters for faking statuses, returnings and more situations as you desire.
	 * By design, you can leave this in a development envinronment and then replace it with a real module without needing to tweak everything, just replace the module with a real one.
	 * @param req Request parameters. MockAPIModule only uses it's own property (mock) for faking the response. If nothing is set, it will always return successfull with undefined data and response body.
	 */
	request<T>(req: MockQueryObject): MockAPIData {
		const MockInit: MockAPIDataInit = {
			status: req.mock?.returnStatus ?? 200,
			ok: !req.mock?.fail,
			data: req.mock?.data,
		};

		const mock = new MockAPIData(MockInit);
		return mock;
		// "simulates" an API request using the QueryObject's body or completely ignores it
		// adds mock behavior to function and class, simulating behaviors depending of whats given for MockQuery object.
		// creates a new MockAPIData and returns to user
		// throw new Error("Method not implemented.");
	}
}
