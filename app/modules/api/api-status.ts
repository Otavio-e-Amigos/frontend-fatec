type Listener = () => void;

const listeners = new Set<Listener>();
let online = true;

export const apiStatus = {
	getSnapshot: () => online,
	getServerSnapshot: () => true,
	report(next: boolean) {
		if (next === online) return;
		online = next;
		listeners.forEach((listener) => listener());
	},
	subscribe(listener: Listener) {
		listeners.add(listener);
		return () => {
			listeners.delete(listener);
		};
	},
};