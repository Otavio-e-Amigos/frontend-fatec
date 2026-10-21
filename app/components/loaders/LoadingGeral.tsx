import React from "react";

interface LoadingProps {
  mensagem?: string;
}

export const LoadingGeral: React.FC<LoadingProps> = ({
  mensagem = "Processando dados do sistema...",
}) => {
  return (
    <div style={overlayStyle}>
      <div style={cardStyle}>
        <style>{`
          .loading-geral {
            --dur: 6s;
            --spin: 2.4s;
            width: 100%;
            max-width: 360px;
            margin: 0 auto;
            position: relative;
          }
          .loading-geral svg { width: 100%; height: auto; display: block; overflow: visible; }

          .loading-geral .part,
          .loading-geral .fill,
          .loading-geral .hand,
          .loading-geral .dash {
            animation-duration: var(--dur);
            animation-iteration-count: infinite;
            animation-timing-function: cubic-bezier(.4, 0, .2, 1);
            animation-fill-mode: both;
          }
          .loading-geral .part { transform-box: fill-box; transform-origin: center; }
          .loading-geral .fill { transform-box: fill-box; transform-origin: left center; animation-timing-function: cubic-bezier(.25, .8, .25, 1); }
          .loading-geral .hand { transform-box: view-box; transform-origin: 165px 200px; }
          .loading-geral .pop  { animation-timing-function: cubic-bezier(.34, 1.56, .64, 1); }

          /* Flutuação sutil de cada etapa */
          .loading-geral .float { animation: lgFloat 2.6s ease-in-out infinite alternate; }
          @keyframes lgFloat { from { transform: translateY(2px); } to { transform: translateY(-2px); } }

          /* Aro interno girando devagar */
          .loading-geral .ring { transform-box: fill-box; transform-origin: center; animation: lgSpin var(--spin) linear infinite; }
          @keyframes lgSpin { to { transform: rotate(360deg); } }
          .loading-geral .ring-inner { transform-box: fill-box; transform-origin: center; animation: lgSpin 30s linear infinite reverse; }

          /* Etapa 1: crachá do professor (esquerda) */
          .loading-geral #lg-badge { animation-name: lgBadge; }
          @keyframes lgBadge {
            0%   { opacity: 0; transform: translateX(0) scale(.88); animation-timing-function: cubic-bezier(.22, 1, .36, 1); }
            7%   { opacity: 1; transform: translateX(0) scale(1); }
            22%  { opacity: 1; transform: translateX(0) scale(1); animation-timing-function: cubic-bezier(.5, 0, 1, 1); }
            32%  { opacity: 0; transform: translateX(65px) scale(.9); }
            100% { opacity: 0; transform: translateX(65px) scale(.9); }
          }
          .loading-geral #lg-ok { animation-name: lgOk; }
          @keyframes lgOk { 0%, 9% { transform: scale(0); } 14%, 100% { transform: scale(1); } }
          .loading-geral #lg-shine { animation-name: lgShine; animation-timing-function: ease-in-out; }
          @keyframes lgShine {
            0%, 9%   { opacity: 0; transform: translateX(-40px); }
            11%      { opacity: 1; }
            19%      { opacity: 1; transform: translateX(110px); }
            20%, 100% { opacity: 0; transform: translateX(110px); }
          }

          /* Etapa 2: relógio de ponto + calendário */
          .loading-geral #lg-clock { animation-name: lgClock; }
          @keyframes lgClock {
            0%, 22% { opacity: 0; transform: translateX(-65px) scale(.9); animation-timing-function: cubic-bezier(.22, 1, .36, 1); }
            32%     { opacity: 1; transform: translateX(0) scale(1); }
            56%     { opacity: 1; transform: translateX(0) scale(1); animation-timing-function: cubic-bezier(.5, 0, 1, 1); }
            64%     { opacity: 0; transform: translateX(18px) scale(.8); }
            100%    { opacity: 0; transform: translateX(18px) scale(.8); }
          }
          .loading-geral #lg-min  { animation-name: lgMin; }
          .loading-geral #lg-hour { animation-name: lgHour; }
          @keyframes lgMin  { 0%, 28% { transform: rotate(0deg); } 56%, 100% { transform: rotate(720deg); } }
          @keyframes lgHour { 0%, 28% { transform: rotate(0deg); } 56%, 100% { transform: rotate(90deg); } }
          .loading-geral #lg-mask-arc { stroke-dasharray: 100; animation-name: lgTicks; animation-timing-function: linear; }
          @keyframes lgTicks { 0%, 30% { stroke-dashoffset: 100; } 52%, 100% { stroke-dashoffset: 0; } }
          .loading-geral #lg-r1 { animation-name: lgR1; }
          .loading-geral #lg-r2 { animation-name: lgR2; }
          .loading-geral #lg-r3 { animation-name: lgR3; }
          .loading-geral #lg-r4 { animation-name: lgR4; }
          @keyframes lgR1 { 0%,32% { transform: scaleX(0); } 38%,100% { transform: scaleX(1); } }
          @keyframes lgR2 { 0%,36% { transform: scaleX(0); } 42%,100% { transform: scaleX(1); } }
          @keyframes lgR3 { 0%,40% { transform: scaleX(0); } 46%,100% { transform: scaleX(1); } }
          @keyframes lgR4 { 0%,44% { transform: scaleX(0); } 50%,100% { transform: scaleX(1); } }

          /* Transição 2: nuvem sincronizada (centro) */
          .loading-geral #lg-cloud { animation-name: lgCloud; }
          @keyframes lgCloud {
            0%, 54% { opacity: 0; transform: scale(.7); }
            61%     { opacity: 1; transform: scale(1); }
            67%     { opacity: 1; transform: scale(1); animation-timing-function: cubic-bezier(.5, 0, 1, 1); }
            74%, 100% { opacity: 0; transform: scale(.7); }
          }
          .loading-geral #lg-arrow { animation-name: lgArrow; }
          @keyframes lgArrow {
            0%, 58% { opacity: 0; transform: translateY(8px); }
            62%     { opacity: 1; transform: translateY(0); }
            69%     { opacity: 1; transform: translateY(-4px); }
            72%, 100% { opacity: 0; transform: translateY(-4px); }
          }
          .loading-geral #lg-cloudok { animation-name: lgCloudOk; }
          @keyframes lgCloudOk { 0%, 62% { transform: scale(0); } 66%, 100% { transform: scale(1); } }

          /* Etapa 3: escudo confirmado (centro) */
          .loading-geral #lg-shield { animation-name: lgShield; }
          @keyframes lgShield {
            0%, 66% { opacity: 0; transform: scale(.6); }
            74%     { opacity: 1; transform: scale(1); }
            92%     { opacity: 1; transform: scale(1); animation-timing-function: cubic-bezier(.5, 0, 1, 1); }
            98%, 100% { opacity: 0; transform: scale(.9); }
          }
          .loading-geral #lg-check { stroke-dasharray: 100; animation-name: lgCheck; animation-timing-function: cubic-bezier(.25, .8, .25, 1); }
          @keyframes lgCheck { 0%, 70% { stroke-dashoffset: 100; } 80%, 100% { stroke-dashoffset: 0; } }
          .loading-geral #lg-rip1 { animation-name: lgRip1; }
          .loading-geral #lg-rip2 { animation-name: lgRip2; }
          @keyframes lgRip1 { 0%, 71% { opacity: 0; transform: scale(.6); } 73% { opacity: .55; transform: scale(.8); } 85%, 100% { opacity: 0; transform: scale(2.1); } }
          @keyframes lgRip2 { 0%, 74% { opacity: 0; transform: scale(.6); } 76% { opacity: .4; transform: scale(.8); } 88%, 100% { opacity: 0; transform: scale(2.1); } }
          .loading-geral #lg-spk { animation-name: lgSpk; }
          @keyframes lgSpk { 0%, 74% { opacity: 0; transform: scale(.4); } 78% { opacity: 1; transform: scale(1.1); } 87%, 100% { opacity: 0; transform: scale(1.3); } }

          /* Textos dentro do círculo */
          .loading-geral .lab { animation-timing-function: ease-in-out; }
          .loading-geral #lg-lab1 { animation-name: lgLab1; }
          .loading-geral #lg-lab2 { animation-name: lgLab2; }
          .loading-geral #lg-lab3 { animation-name: lgLab3; }
          @keyframes lgLab1 { 0% { opacity: 0; transform: translateY(6px); } 5%, 24% { opacity: 1; transform: translateY(0); } 30%, 100% { opacity: 0; transform: translateY(-6px); } }
          @keyframes lgLab2 { 0%, 28% { opacity: 0; transform: translateY(6px); } 34%, 58% { opacity: 1; transform: translateY(0); } 64%, 100% { opacity: 0; transform: translateY(-6px); } }
          @keyframes lgLab3 { 0%, 72% { opacity: 0; transform: translateY(6px); } 79%, 92% { opacity: 1; transform: translateY(0); } 97%, 100% { opacity: 0; transform: translateY(-4px); } }

          /* Pílulas de progresso */
          .loading-geral .dot { transform-box: fill-box; transform-origin: center; }
          .loading-geral #lg-dot1 { animation-name: lgDot1; }
          .loading-geral #lg-dot2 { animation-name: lgDot2; }
          .loading-geral #lg-dot3 { animation-name: lgDot3; }
          @keyframes lgDot1 {
            0%, 28%   { fill: #b20000; opacity: 1; transform: scaleX(1.3); }
            31%, 100% { fill: #cbd5e1; opacity: .6; transform: scaleX(1); }
          }
          @keyframes lgDot2 {
            0%, 28%   { fill: #b20000; opacity: .6; transform: scaleX(1); }
            31%, 60%  { fill: #b20000; opacity: 1; transform: scaleX(1.3); }
            63%, 100% { fill: #cbd5e1; opacity: .6; transform: scaleX(1); }
          }
          @keyframes lgDot3 {
            0%, 60%   { fill: #cbd5e1; opacity: .6; transform: scaleX(1); }
            64%, 94%  { fill: #b20000; opacity: 1; transform: scaleX(1.3); }
            97%, 100% { fill: #cbd5e1; opacity: .6; transform: scaleX(1); }
          }

          @media (prefers-reduced-motion: reduce) {
            .loading-geral * { animation: none !important; }
            .loading-geral #lg-badge, .loading-geral #lg-clock, .loading-geral #lg-cloud,
            .loading-geral #lg-lab1, .loading-geral #lg-lab2, .loading-geral #lg-rip1,
            .loading-geral #lg-rip2, .loading-geral #lg-spk { opacity: 0; }
            .loading-geral #lg-dot3 { fill: #b20000; }
          }
        `}</style>

        <div className="loading-geral" role="status" aria-live="polite">
          <svg
            viewBox="0 0 400 400"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Carregando Sistema"
          >
            <defs>
              <linearGradient
                id="lg-grad-bg"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#b20000" />
                <stop offset="100%" stopColor="#7e0000" />
              </linearGradient>
              <linearGradient
                id="lg-grad-blue"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#b20000" />
                <stop offset="100%" stopColor="#3c0900" />
              </linearGradient>
              <linearGradient
                id="lg-grad-ring"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#ff4d4d" />
                <stop offset="100%" stopColor="#3c0900" />
              </linearGradient>
              <filter
                id="lg-shadow"
                x="-25%"
                y="-25%"
                width="150%"
                height="160%"
              >
                <feDropShadow
                  dx="0"
                  dy="8"
                  stdDeviation="10"
                  floodColor="#0f172a"
                  floodOpacity="0.12"
                />
              </filter>
              <filter id="lg-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" />
              </filter>
              <mask
                id="lg-mask"
                maskUnits="userSpaceOnUse"
                x="120"
                y="155"
                width="90"
                height="90"
              >
                <circle
                  id="lg-mask-arc"
                  className="dash"
                  cx="165"
                  cy="200"
                  r="25"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="14"
                  pathLength="100"
                  transform="rotate(-90 165 200)"
                />
              </mask>
              <clipPath id="lg-clip-badge">
                <rect x="82" y="145" width="76" height="102" rx="12" />
              </clipPath>
            </defs>

            {/* Disco central */}
            <circle
              cx="200"
              cy="200"
              r="162"
              fill="url(#lg-grad-bg)"
              filter="url(#lg-shadow)"
            />
            <circle
              className="ring-inner"
              cx="200"
              cy="200"
              r="150"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="1.5"
              strokeDasharray="2 7"
              strokeLinecap="round"
            />

            {/* Trilho + arco azul girando */}
            <circle
              cx="200"
              cy="200"
              r="174"
              fill="none"
              stroke="#b20000"
              strokeWidth="10"
            />
            <g className="ring">
              <circle
                cx="200"
                cy="200"
                r="174"
                fill="none"
                stroke="#b20000"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray="260 834"
                opacity=".35"
                filter="url(#lg-glow)"
              />
              <circle
                cx="200"
                cy="200"
                r="174"
                fill="none"
                stroke="#b20000"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="260 834"
              />
            </g>

            {/* Conteúdo central */}
            <g transform="translate(0 -22)">
              {/* ETAPA 1: crachá do professor */}
              <g id="lg-badge" className="part" filter="url(#lg-shadow)">
                <g className="float">
                  <rect
                    x="82"
                    y="145"
                    width="76"
                    height="102"
                    rx="12"
                    fill="#fff"
                    stroke="#cbd5e1"
                    strokeWidth="1"
                  />
                  <rect
                    x="108"
                    y="152"
                    width="24"
                    height="6"
                    rx="3"
                    fill="#cbd5e1"
                  />
                  <circle cx="120" cy="186" r="18" fill="#b20000" />
                  <circle cx="120" cy="181" r="6" fill="#b20000" />
									<path d="M106 199 q14 -18 28 0z" fill="#b20000" />
								<rect
                  	x="94"
                    y="215"
                    width="52"
                    height="6"
                    rx="3"
                    fill="#cbd5e1"
                  />
                  <rect
                    x="102"
                    y="227"
                    width="36"
                    height="6"
                    rx="3"
                    fill="#dbe7f8"
                  />

                  {/* brilho de validação */}
                  <g clipPath="url(#lg-clip-badge)">
                    <g id="lg-shine" className="part">
                      <rect
                        x="64"
                        y="130"
                        width="16"
                        height="130"
                        fill="#fff"
                        opacity=".75"
                        transform="rotate(20 120 196)"
                      />
                    </g>
                  </g>

                  {/* check verde */}
                  <g id="lg-ok" className="part pop">
                    <circle
                      cx="152"
                      cy="240"
                      r="14"
                      fill="#22c55e"
                      stroke="#fff"
                      strokeWidth="3"
                    />
                    <path
                      d="M145 240 l4 4.5 l8 -9"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </g>
              </g>

              {/* ETAPA 2: relógio de ponto + calendário */}
              <g id="lg-clock" className="part" filter="url(#lg-shadow)">
                <g className="float">
                  <circle
                    cx="165"
                    cy="200"
                    r="34"
                    fill="#fff"
                    stroke="#cbd5e1"
                    strokeWidth="2"
                  />
                  <circle
                    cx="165"
                    cy="200"
                    r="26"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="5"
                    pathLength="120"
                    strokeDasharray="2 8"
                    transform="rotate(-90 165 200)"
                  />
                  <circle
                    cx="165"
                    cy="200"
                    r="26"
                    fill="none"
                    stroke="#b20000"
                    strokeWidth="5"
                    pathLength="120"
                    strokeDasharray="2 8"
                    transform="rotate(-90 165 200)"
                    mask="url(#lg-mask)"
                  />
                  <line
                    id="lg-hour"
                    className="hand"
                    x1="165"
                    y1="200"
                    x2="165"
                    y2="189"
                    stroke="#1e293b"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <line
                    id="lg-min"
                    className="hand"
                    x1="165"
                    y1="200"
                    x2="165"
                    y2="178"
                    stroke="#b20000"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <circle cx="165" cy="200" r="3.5" fill="#1e293b" />

                  <rect
                    x="206"
                    y="164"
                    width="62"
                    height="72"
                    rx="10"
                    fill="#fff"
                    stroke="#cbd5e1"
                    strokeWidth="1"
                  />
                  <path
                    d="M206 174 a10 10 0 0 1 10 -10 h42 a10 10 0 0 1 10 10 v10 h-62z"
                    fill="url(#lg-grad-blue)"
                  />
                  <rect
                    x="218"
                    y="159"
                    width="4"
                    height="11"
                    rx="2"
                    fill="#475569"
                  />
                  <rect
                    x="248"
                    y="159"
                    width="4"
                    height="11"
                    rx="2"
                    fill="#475569"
                  />
                  <g fill="#e2e8f0">
                    <rect x="215" y="190" width="44" height="6" rx="3" />
                    <rect x="215" y="202" width="44" height="6" rx="3" />
                    <rect x="215" y="214" width="44" height="6" rx="3" />
                    <rect x="215" y="226" width="44" height="6" rx="3" />
                  </g>
                  <g fill="#b20000">
                    <rect
                      id="lg-r1"
                      className="fill"
                      x="215"
                      y="190"
                      width="44"
                      height="6"
                      rx="3"
                    />
                    <rect
                      id="lg-r2"
                      className="fill"
                      x="215"
                      y="202"
                      width="44"
                      height="6"
                      rx="3"
                    />
                    <rect
                      id="lg-r3"
                      className="fill"
                      x="215"
                      y="214"
                      width="44"
                      height="6"
                      rx="3"
                    />
                    <rect
                      id="lg-r4"
                      className="fill"
                      x="215"
                      y="226"
                      width="44"
                      height="6"
                      rx="3"
                    />
                  </g>
                </g>
              </g>

              {/* TRANSIÇÃO: nuvem sincronizada */}
              <g id="lg-cloud" className="part" filter="url(#lg-shadow)">
                <g fill="url(#lg-grad-blue)">
                  <circle cx="176" cy="206" r="18" />
                  <circle cx="200" cy="194" r="26" />
                  <circle cx="224" cy="208" r="16" />
                  <rect x="176" y="206" width="48" height="18" />
                </g>
                <g
                  id="lg-arrow"
                  className="part"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="200" y1="214" x2="200" y2="190" />
                  <polyline points="190,200 200,190 210,200" />
                </g>
                <g id="lg-cloudok" className="part pop">
                  <circle
                    cx="228"
                    cy="224"
                    r="11"
                    fill="#22c55e"
                    stroke="#fff"
                    strokeWidth="3"
                  />
                  <path
                    d="M222 224 l4 4 l8 -8"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </g>

              {/* ETAPA 3: escudo confirmado */}
              <circle
                id="lg-rip1"
                className="part"
                cx="200"
                cy="192"
                r="42"
                fill="none"
                stroke="#b20000"
                strokeWidth="3"
              />
              <circle
                id="lg-rip2"
                className="part"
                cx="200"
                cy="192"
                r="42"
                fill="none"
                stroke="#60a5fa"
                strokeWidth="2"
              />
              <g id="lg-spk" className="part" fill="#b20000">
                <circle cx="152" cy="146" r="3" />
                <circle cx="250" cy="150" r="2.5" fill="#b20000" />
                <circle cx="146" cy="224" r="2.5" fill="#b20000" />
                <circle cx="256" cy="222" r="3" />
                <circle cx="200" cy="116" r="2.5" fill="#b20000" />
              </g>
              <g id="lg-shield" className="part pop" filter="url(#lg-shadow)">
                <g className="float">
                  <path
                    d="M200 135 L240 149 V193 C240 222 223 239 200 249 C177 239 160 222 160 193 V149 Z"
                    fill="#fff"
                    stroke="#b20000"
                    strokeWidth="6"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M200 144 L232 156 V193 C232 215 219 230 200 239 C181 230 168 215 168 193 V156 Z"
                    fill="#eff6ff"
                  />
                  <path
                    id="lg-check"
                    className="dash"
                    d="M182 192 L196 206 L221 177"
                    pathLength="100"
                    fill="none"
                    stroke="#b20000"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </g>
            </g>

            {/* Textos dentro do círculo */}
            <g
              fontSize="12"
              fontWeight="700"
              letterSpacing="1.2"
              fill="#1e293b"
              textAnchor="middle"
            >
              <text id="lg-lab1" className="part lab" x="200" y="262">
                Validando acesso
              </text>
              <text id="lg-lab2" className="part lab" x="200" y="262">
                Calculando horas
              </text>
              <text
                id="lg-lab3"
                className="part lab"
                x="200"
                y="262"
                fontWeight="800"
                letterSpacing="1.8"
              >
                SINCRONIZADO
              </text>
            </g>

            {/* Pílulas de progresso */}
            <g transform="translate(161, 292)">
              <rect
                id="lg-dot1"
                className="part dot"
                x="0"
                y="0"
                width="22"
                height="6"
                rx="3"
                fill="#cbd5e1"
              />
              <rect
                id="lg-dot2"
                className="part dot"
                x="28"
                y="0"
                width="22"
                height="6"
                rx="3"
                fill="#cbd5e1"
              />
              <rect
                id="lg-dot3"
                className="part dot"
                x="56"
                y="0"
                width="22"
                height="6"
                rx="3"
                fill="#cbd5e1"
              />
            </g>
          </svg>
        </div>
        <p style={captionStyle}>{mensagem}</p>
      </div>
    </div>
  );
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "#e2e6e9",
  backdropFilter: "blur(4px)",
  display: "grid",
  placeItems: "center",
  zIndex: 9999,
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  padding: "28px",
  borderRadius: "20px",
  boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "340px",
};

const captionStyle: React.CSSProperties = {
  marginTop: "14px",
  color: "#1e293b",
  fontSize: "15px",
  fontWeight: 600,
  textAlign: "center",
};
