import { useSyncExternalStore } from "react";
import { apiStatus } from "~/modules/api/api-status";

/** true = última requisição chegou na API; false = API não respondeu. */
export default function useApiStatus() {
	return useSyncExternalStore(
		apiStatus.subscribe,
		apiStatus.getSnapshot,
		apiStatus.getServerSnapshot,
	);
}