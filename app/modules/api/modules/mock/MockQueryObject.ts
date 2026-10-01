import type AbstractQueryObject from "../../base/AbstractQueryObject";

export default interface MockQueryObject extends AbstractQueryObject {
	mock?: {
		returnStatus?: number; //mock return status number
		fail?: boolean; //fake error when returning
		data?: any; //simulated data return
		delay?: number; //delay time in milliseconds before returning response
		wrapper?: any; //wrapper for data attribute
	};
}
