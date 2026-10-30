export default function ShadowCenter({children, onClick}: {children?:any, onClick?:(e?:any) => void}) {
	return (
		<div
			className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
			// onClick={() => {
				// // console.log("click!", window);
				// // if (window?.dismissible) {
				// if (dismissible) {
				// 	// console.log("exiting window!");
				// 	// window?.hide?.();
				// }
			// }}
			onClick={onClick}
		>
			{children}
		</div>
	);
}
