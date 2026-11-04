import React from "react";
import { HeaderBrand } from "~/layouts/Header";

// interface LoadingProps {
  // mensagem?: string;
// }

export const LoadingGeralWIP: React.FC = ({
  // mensagem = "Processando dados do sistema...",
}) => {
  return (
		<div className="fixed w-screen h-svh z-50 place-items-end grid bg-slate-800/50 backdrop-blur-md">
			<div className="fixed w-screen h-svh place-items-end grid -top-6 right-10">
				<HeaderBrand noRedirect/>
			</div>
   </div>
  );
};

// const overlayStyle: React.CSSProperties = {
//   position: "fixed",
//   top: 0,
//   left: 0,
//   width: "100vw",
//   height: "100vh",
//   backgroundColor: "#e2e6e9",
//   backdropFilter: "blur(4px)",
//   display: "grid",
//   placeItems: "center",
//   zIndex: 9999,
// };

// const cardStyle: React.CSSProperties = {
//   backgroundColor: "#ffffff",
//   padding: "28px",
//   borderRadius: "20px",
//   boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
//   width: "340px",
// };

// const captionStyle: React.CSSProperties = {
//   marginTop: "14px",
//   color: "#1e293b",
//   fontSize: "15px",
//   fontWeight: 600,
//   textAlign: "center",
// };
