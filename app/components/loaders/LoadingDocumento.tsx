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
          .loading-circular {
            --dur: 6s;
            --spin: 3s;
            width: 100%;
            max-width: 380px;
            margin: 0 auto;
            position: relative;
          }

          .loading-circular svg {
            width: 100%;
            height: auto;
            display: block;
            overflow: visible;
          }

          .loading-circular .stage,
          .loading-circular .part,
          .loading-circular .fill,
          .loading-circular .dot,
          .loading-circular .dash {
            animation-duration: var(--dur);
            animation-iteration-count: infinite;
            animation-timing-function: cubic-bezier(.4, 0, .2, 1);
            animation-fill-mode: both;
          }

          .loading-circular .stage {
            transform-box: view-box;
            transform-origin: 200px 200px;
          }

          .loading-circular .part {
            transform-box: fill-box;
            transform-origin: center;
          }

          .loading-circular .fill {
            transform-box: fill-box;
            transform-origin: left center;
            animation-timing-function: cubic-bezier(.25, .8, .25, 1);
          }

          .loading-circular .dot {
            transform-box: fill-box;
            transform-origin: center;
          }

          .loading-circular .pop {
            animation-timing-function: cubic-bezier(.34, 1.56, .64, 1);
          }

          .loading-circular .float {
            animation: lcFloat 3.6s ease-in-out infinite alternate;
          }

          @keyframes lcFloat {
            from { transform: translateY(2px); }
            to { transform: translateY(-3px); }
          }

          .loading-circular .ring {
            transform-box: fill-box;
            transform-origin: center;
            animation: lcSpin var(--spin) linear infinite;
          }

          @keyframes lcSpin {
            to { transform: rotate(360deg); }
          }

          .loading-circular .ring-inner {
            transform-box: fill-box;
            transform-origin: center;
            animation: lcSpin 40s linear infinite reverse;
          }

          /* ETAPA 1 */
          .loading-circular #lc-s1 { animation-name: lcS1; }
          @keyframes lcS1 {
            0%, 100% { opacity: 0; transform: scale(.9) translateY(12px); }
            6% { opacity: 1; transform: scale(1) translateY(0); animation-timing-function: linear; }
            35% { opacity: 1; transform: scale(1) translateY(0); animation-timing-function: cubic-bezier(.5, 0, 1, 1); }
            39% { opacity: 0; transform: scale(.94) translateY(-8px); }
          }

          .loading-circular #lc-f1 { animation-name: lcF1; }
          .loading-circular #lc-f2 { animation-name: lcF2; }
          .loading-circular #lc-f3 { animation-name: lcF3; }
          .loading-circular #lc-f4 { animation-name: lcF4; }

          @keyframes lcF1 { 0%, 8% { transform: scaleX(0); } 12%, 100% { transform: scaleX(1); } }
          @keyframes lcF2 { 0%, 12% { transform: scaleX(0); } 16%, 100% { transform: scaleX(1); } }
          @keyframes lcF3 { 0%, 16% { transform: scaleX(0); } 20%, 100% { transform: scaleX(1); } }
          @keyframes lcF4 { 0%, 20% { transform: scaleX(0); } 24%, 100% { transform: scaleX(1); } }

          .loading-circular #lc-c1 { animation-name: lcC1; }
          .loading-circular #lc-c2 { animation-name: lcC2; }
          .loading-circular #lc-c3 { animation-name: lcC3; }
          .loading-circular #lc-c4 { animation-name: lcC4; }

          @keyframes lcC1 { 0%, 11% { transform: scale(0); } 14%, 100% { transform: scale(1); } }
          @keyframes lcC2 { 0%, 15% { transform: scale(0); } 18%, 100% { transform: scale(1); } }
          @keyframes lcC3 { 0%, 19% { transform: scale(0); } 22%, 100% { transform: scale(1); } }
          @keyframes lcC4 { 0%, 23% { transform: scale(0); } 26%, 100% { transform: scale(1); } }

          .loading-circular #lc-scan { animation-name: lcScan; }
          @keyframes lcScan {
            0%, 24% { opacity: 0; transform: translateY(0); }
            26% { opacity: 1; }
            30% { opacity: 1; transform: translateY(112px); }
            31%, 100% { opacity: 0; transform: translateY(112px); }
          }

          .loading-circular #lc-sig {
            stroke-dasharray: 100;
            animation-name: lcSig;
            animation-timing-function: linear;
          }
          @keyframes lcSig {
            0%, 29% { stroke-dashoffset: 100; }
            34%, 100% { stroke-dashoffset: 0; }
          }

          /* ETAPA 2 */
          .loading-circular #lc-s2 { animation-name: lcS2; }
          @keyframes lcS2 {
            0%, 37%, 100% { opacity: 0; transform: scale(.9) translateY(12px); }
            43% { opacity: 1; transform: scale(1) translateY(0); animation-timing-function: linear; }
            63% { opacity: 1; transform: scale(1) translateY(0); animation-timing-function: cubic-bezier(.5, 0, 1, 1); }
            67% { opacity: 0; transform: scale(.94) translateY(-8px); }
          }

          .loading-circular #lc-in { animation-name: lcIn; }
          @keyframes lcIn {
            0%, 45% { transform: translateY(0); }
            57%, 100% { transform: translateY(118px); }
          }

          .loading-circular #lc-out { animation-name: lcOut; }
          @keyframes lcOut {
            0%, 49% { transform: translateY(-70px); }
            62%, 100% { transform: translateY(0); }
          }

          .loading-circular #lc-printer {
            animation-name: lcShake;
            animation-timing-function: linear;
          }
          @keyframes lcShake {
            0%, 46%, 59%, 100% { transform: translateY(0); }
            48%, 52%, 56% { transform: translateY(-1px); }
            50%, 54%, 58% { transform: translateY(0); }
          }

          .loading-circular #lc-prog {
            animation-name: lcProg;
            animation-timing-function: linear;
          }
          @keyframes lcProg {
            0%, 45% { transform: scaleX(0); }
            60%, 100% { transform: scaleX(1); }
          }

          .loading-circular #lc-led {
            animation-name: lcLed;
            animation-timing-function: steps(1);
          }
          @keyframes lcLed {
            0%, 44%, 100% { opacity: .35; }
            45%, 62% { opacity: 1; }
            63% { opacity: .35; }
          }

          /* ETAPA 3 */
          .loading-circular #lc-s3 { animation-name: lcS3; }
          @keyframes lcS3 {
            0%, 65%, 100% { opacity: 0; transform: scale(.9) translateY(12px); }
            71% { opacity: 1; transform: scale(1) translateY(0); animation-timing-function: linear; }
            94% { opacity: 1; transform: scale(1) translateY(0); animation-timing-function: cubic-bezier(.5, 0, 1, 1); }
            98% { opacity: 0; transform: scale(.94) translateY(-8px); }
          }

          .loading-circular #lc-docx { animation-name: lcDocx; }
          .loading-circular #lc-pdf { animation-name: lcPdf; }
          @keyframes lcDocx {
            0%, 67% { opacity: 0; transform: scale(.3) rotate(-8deg); }
            73%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
          }
          @keyframes lcPdf {
            0%, 69% { opacity: 0; transform: scale(.3) rotate(8deg); }
            75%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
          }

          .loading-circular #lc-bd { animation-name: lcBd; }
          .loading-circular #lc-bp { animation-name: lcBp; }
          @keyframes lcBd {
            0%, 74% { transform: scale(0); }
            78%, 100% { transform: scale(1); }
          }
          @keyframes lcBp {
            0%, 76% { transform: scale(0); }
            80%, 100% { transform: scale(1); }
          }

          .loading-circular #lc-sparks { animation-name: lcSparks; }
          @keyframes lcSparks {
            0%, 72% { opacity: 0; transform: scale(.6); }
            75% { opacity: 1; transform: scale(1); }
            83%, 100% { opacity: 0; transform: scale(1.25); }
          }

          /* DOTS INDICADORES */
          .loading-circular #lc-step1-dot { animation-name: lcDot1; }
          .loading-circular #lc-step2-dot { animation-name: lcDot2; }
          .loading-circular #lc-step3-dot { animation-name: lcDot3; }

          @keyframes lcDot1 {
            0%, 35% { fill: #2563eb; opacity: 1; transform: scaleX(1.3); }
            39%, 100% { fill: #cbd5e1; opacity: .6; transform: scaleX(1); }
          }
          @keyframes lcDot2 {
            0%, 35% { fill: #cbd5e1; opacity: .6; transform: scaleX(1); }
            39%, 63% { fill: #2563eb; opacity: 1; transform: scaleX(1.3); }
            67%, 100% { fill: #cbd5e1; opacity: .6; transform: scaleX(1); }
          }
          @keyframes lcDot3 {
            0%, 63% { fill: #cbd5e1; opacity: .6; transform: scaleX(1); }
            67%, 95% { fill: #2563eb; opacity: 1; transform: scaleX(1.3); }
            98%, 100% { fill: #cbd5e1; opacity: .6; transform: scaleX(1); }
          }

          .loading-circular .cap {
            transform-box: fill-box;
            transform-origin: center;
            opacity: 0;
            animation-duration: var(--dur);
            animation-iteration-count: infinite;
            animation-timing-function: ease-in-out;
            animation-fill-mode: both;
          }

          .loading-circular #lc-cap1 { animation-name: lcCap1; }
          .loading-circular #lc-cap2 { animation-name: lcCap2; }
          .loading-circular #lc-cap3 { animation-name: lcCap3; }

          @keyframes lcCap1 {
            0%, 100% { opacity: 0; transform: translateY(6px); }
            4%, 35% { opacity: 1; transform: translateY(0); }
            39% { opacity: 0; transform: translateY(-6px); }
          }
          @keyframes lcCap2 {
            0%, 38%, 100% { opacity: 0; transform: translateY(6px); }
            42%, 62% { opacity: 1; transform: translateY(0); }
            66% { opacity: 0; transform: translateY(-6px); }
          }
          @keyframes lcCap3 {
            0%, 66%, 100% { opacity: 0; transform: translateY(6px); }
            70%, 94% { opacity: 1; transform: translateY(0); }
            98% { opacity: 0; transform: translateY(-6px); }
          }
        `}</style>

        <div className="loading-circular" role="status" aria-live="polite">
          <svg
            viewBox="0 0 400 400"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Gerando Folha de Ponto Docente"
          >
            <defs>
              <linearGradient
                id="lc-grad-bg"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#f1f5f9" />
              </linearGradient>
              <linearGradient
                id="lc-grad-blue"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
              <linearGradient
                id="lc-grad-red"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#b91c1c" />
              </linearGradient>
              <linearGradient
                id="lc-grad-printer"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#475569" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
              <linearGradient
                id="lc-grad-ring"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
              <linearGradient
                id="lc-grad-scan"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0" />
                <stop offset="60%" stopColor="#3b82f6" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0.75" />
              </linearGradient>

              <filter
                id="lc-shadow-card"
                x="-20%"
                y="-20%"
                width="140%"
                height="150%"
              >
                <feDropShadow
                  dx="0"
                  dy="8"
                  stdDeviation="10"
                  floodColor="#0f172a"
                  floodOpacity="0.12"
                />
              </filter>
              <filter
                id="lc-glow-ring"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feGaussianBlur stdDeviation="5" />
              </filter>

              <clipPath id="lc-clip-in">
                <rect x="100" y="70" width="200" height="145" />
              </clipPath>
              <clipPath id="lc-clip-out">
                <rect x="100" y="215" width="200" height="130" />
              </clipPath>
            </defs>

            {/* Disco central */}
            <circle
              cx="200"
              cy="200"
              r="162"
              fill="url(#lc-grad-bg)"
              filter="url(#lc-shadow-card)"
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
              stroke="#dbeafe"
              strokeWidth="10"
            />
            <g className="ring">
              <circle
                cx="200"
                cy="200"
                r="174"
                fill="none"
                stroke="#2563EB"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray="260 834"
                opacity=".35"
                filter="url(#lc-glow-ring)"
              />
              <circle
                cx="200"
                cy="200"
                r="174"
                fill="none"
                stroke="#2563EB"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="260 834"
              />
            </g>

            <g transform="translate(0 -30)">
              {/* ETAPA 1 */}
              <g id="lc-s1" className="stage" filter="url(#lc-shadow-card)">
                <g className="float">
                  <rect
                    x="135"
                    y="105"
                    width="130"
                    height="175"
                    rx="12"
                    fill="#fff"
                    stroke="#cbd5e1"
                    strokeWidth="1"
                  />
                  <path
                    d="M135 117 a12 12 0 0 1 12 -12 h106 a12 12 0 0 1 12 12 v12 h-130z"
                    fill="url(#lc-grad-blue)"
                  />
                  <circle cx="149" cy="117" r="3" fill="#fff" opacity="0.9" />
                  <circle cx="159" cy="117" r="3" fill="#fff" opacity="0.6" />
                  <text
                    x="200"
                    y="142"
                    fontSize="10.5"
                    fontWeight="700"
                    fill="#1e293b"
                    textAnchor="middle"
                  >
                    Folha de Ponto Docente
                  </text>
                  <line
                    x1="147"
                    y1="151"
                    x2="253"
                    y2="151"
                    stroke="#f1f5f9"
                    strokeWidth="2"
                  />

                  <g fill="#e2e8f0">
                    <rect x="147" y="162" width="30" height="10" rx="5" />
                    <rect x="147" y="186" width="30" height="10" rx="5" />
                    <rect x="147" y="210" width="30" height="10" rx="5" />
                    <rect x="147" y="234" width="30" height="10" rx="5" />
                  </g>
                  <g fill="#f1f5f9">
                    <rect x="183" y="162" width="58" height="10" rx="5" />
                    <rect x="183" y="186" width="58" height="10" rx="5" />
                    <rect x="183" y="210" width="58" height="10" rx="5" />
                    <rect x="183" y="234" width="58" height="10" rx="5" />
                  </g>
                  <g fill="#2563eb">
                    <rect
                      id="lc-f1"
                      className="fill"
                      x="183"
                      y="162"
                      width="58"
                      height="10"
                      rx="5"
                    />
                    <rect
                      id="lc-f2"
                      className="fill"
                      x="183"
                      y="186"
                      width="58"
                      height="10"
                      rx="5"
                    />
                    <rect
                      id="lc-f3"
                      className="fill"
                      x="183"
                      y="210"
                      width="58"
                      height="10"
                      rx="5"
                    />
                    <rect
                      id="lc-f4"
                      className="fill"
                      x="183"
                      y="234"
                      width="58"
                      height="10"
                      rx="5"
                    />
                  </g>

                  {/* Checks */}
                  <g transform="translate(252 167)">
                    <g id="lc-c1" className="part pop">
                      <circle r="5.5" fill="#2563eb" />
                      <path
                        d="M-2.6 .2 l1.9 2 l3.4 -3.9"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </g>
                  <g transform="translate(252 191)">
                    <g id="lc-c2" className="part pop">
                      <circle r="5.5" fill="#2563eb" />
                      <path
                        d="M-2.6 .2 l1.9 2 l3.4 -3.9"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </g>
                  <g transform="translate(252 215)">
                    <g id="lc-c3" className="part pop">
                      <circle r="5.5" fill="#2563eb" />
                      <path
                        d="M-2.6 .2 l1.9 2 l3.4 -3.9"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </g>
                  <g transform="translate(252 239)">
                    <g id="lc-c4" className="part pop">
                      <circle r="5.5" fill="#2563eb" />
                      <path
                        d="M-2.6 .2 l1.9 2 l3.4 -3.9"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </g>

                  {/* Assinatura */}
                  <line
                    x1="147"
                    y1="268"
                    x2="253"
                    y2="268"
                    stroke="#e2e8f0"
                    strokeWidth="2"
                  />
                  <path
                    id="lc-sig"
                    className="dash"
                    d="M149 263 q6 -12 11 -1 t11 0 t11 0 t11 0 t11 0 t11 0 t11 0"
                    pathLength="100"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />

                  {/* Laser */}
                  <g id="lc-scan" className="part">
                    <rect
                      x="135"
                      y="145"
                      width="130"
                      height="12"
                      fill="url(#lc-grad-scan)"
                    />
                    <line
                      x1="135"
                      y1="157"
                      x2="265"
                      y2="157"
                      stroke="#60a5fa"
                      strokeWidth="2"
                    />
                  </g>
                </g>
              </g>

              {/* ETAPA 2 */}
              <g id="lc-s2" className="stage" filter="url(#lc-shadow-card)">
                <g className="float">
                  <g id="lc-printer" className="part">
                    <g clipPath="url(#lc-clip-in)">
                      <g id="lc-in" className="part">
                        <rect
                          x="162"
                          y="100"
                          width="76"
                          height="100"
                          rx="6"
                          fill="#fff"
                          stroke="#cbd5e1"
                        />
                        <g
                          stroke="#93b4ec"
                          strokeWidth="4"
                          strokeLinecap="round"
                        >
                          <line x1="174" y1="120" x2="226" y2="120" />
                          <line x1="174" y1="136" x2="218" y2="136" />
                          <line x1="174" y1="152" x2="226" y2="152" />
                          <line x1="174" y1="168" x2="206" y2="168" />
                        </g>
                      </g>
                    </g>

                    <g clipPath="url(#lc-clip-out)">
                      <g id="lc-out" className="part">
                        <rect
                          x="162"
                          y="260"
                          width="76"
                          height="70"
                          rx="6"
                          fill="#fff"
                          stroke="#cbd5e1"
                        />
                        <rect
                          x="162"
                          y="260"
                          width="76"
                          height="8"
                          fill="#dbeafe"
                        />
                        <g
                          stroke="#2563eb"
                          strokeWidth="4"
                          strokeLinecap="round"
                        >
                          <line x1="174" y1="282" x2="226" y2="282" />
                          <line x1="174" y1="296" x2="218" y2="296" />
                          <line x1="174" y1="310" x2="204" y2="310" />
                        </g>
                      </g>
                    </g>

                    <rect
                      x="120"
                      y="210"
                      width="160"
                      height="55"
                      rx="14"
                      fill="url(#lc-grad-printer)"
                    />
                    <rect
                      x="138"
                      y="198"
                      width="124"
                      height="18"
                      rx="8"
                      fill="#0f172a"
                    />
                    <rect
                      x="148"
                      y="222"
                      width="104"
                      height="6"
                      rx="3"
                      fill="#020617"
                    />
                    <rect
                      x="140"
                      y="241"
                      width="70"
                      height="5"
                      rx="2.5"
                      fill="#334155"
                    />
                    <rect
                      id="lc-prog"
                      className="fill"
                      x="140"
                      y="241"
                      width="70"
                      height="5"
                      rx="2.5"
                      fill="#38bdf8"
                    />
                    <circle
                      id="lc-led"
                      className="part"
                      cx="262"
                      cy="243"
                      r="4"
                      fill="#38bdf8"
                    />
                  </g>
                </g>
              </g>
            </g>

            <g transform="translate(0 -8)">
              {/* ETAPA 3 */}
              <g id="lc-s3" className="stage">
                <g
                  id="lc-sparks"
                  className="part"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                >
                  <line
                    transform="rotate(0 200 196)"
                    x1="200"
                    y1="100"
                    x2="200"
                    y2="88"
                    stroke="#3b82f6"
                  />
                  <line
                    transform="rotate(45 200 196)"
                    x1="200"
                    y1="100"
                    x2="200"
                    y2="90"
                    stroke="#93c5fd"
                  />
                  <line
                    transform="rotate(90 200 196)"
                    x1="200"
                    y1="100"
                    x2="200"
                    y2="88"
                    stroke="#3b82f6"
                  />
                  <line
                    transform="rotate(135 200 196)"
                    x1="200"
                    y1="100"
                    x2="200"
                    y2="90"
                    stroke="#93c5fd"
                  />
                  <line
                    transform="rotate(180 200 196)"
                    x1="200"
                    y1="100"
                    x2="200"
                    y2="88"
                    stroke="#3b82f6"
                  />
                  <line
                    transform="rotate(225 200 196)"
                    x1="200"
                    y1="100"
                    x2="200"
                    y2="90"
                    stroke="#93c5fd"
                  />
                  <line
                    transform="rotate(270 200 196)"
                    x1="200"
                    y1="100"
                    x2="200"
                    y2="88"
                    stroke="#3b82f6"
                  />
                  <line
                    transform="rotate(315 200 196)"
                    x1="200"
                    y1="100"
                    x2="200"
                    y2="90"
                    stroke="#93c5fd"
                  />
                </g>

                <g className="float">
                  <g
                    id="lc-docx"
                    className="part pop"
                    filter="url(#lc-shadow-card)"
                  >
                    <path
                      d="M127 148 h38 l24 24 v60 a12 12 0 0 1 -12 12 h-50 a12 12 0 0 1 -12 -12 v-72 a12 12 0 0 1 12 -12z"
                      fill="url(#lc-grad-blue)"
                    />
                    <path
                      d="M165 148 l24 24 h-12 a12 12 0 0 1 -12 -12z"
                      fill="#fff"
                      opacity=".3"
                    />
                    <rect
                      x="125"
                      y="160"
                      width="28"
                      height="28"
                      rx="6"
                      fill="#1e40af"
                    />
                    <text
                      x="139"
                      y="180"
                      fontSize="17"
                      fontWeight="800"
                      fill="#fff"
                      textAnchor="middle"
                    >
                      W
                    </text>
                    <text
                      x="152"
                      y="228"
                      fontSize="15"
                      fontWeight="700"
                      fill="#fff"
                      textAnchor="middle"
                    >
                      .docx
                    </text>
                  </g>
                  <g id="lc-bd" className="part pop">
                    <circle
                      cx="186"
                      cy="242"
                      r="11"
                      fill="#fff"
                      stroke="#2563eb"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M181 242 l3.5 3.5 l6.5 -7.5"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>

                  <g
                    id="lc-pdf"
                    className="part pop"
                    filter="url(#lc-shadow-card)"
                  >
                    <path
                      d="M223 148 h38 l24 24 v60 a12 12 0 0 1 -12 12 h-50 a12 12 0 0 1 -12 -12 v-72 a12 12 0 0 1 12 -12z"
                      fill="url(#lc-grad-red)"
                    />
                    <path
                      d="M261 148 l24 24 h-12 a12 12 0 0 1 -12 -12z"
                      fill="#fff"
                      opacity=".3"
                    />
                    <rect
                      x="221"
                      y="160"
                      width="28"
                      height="28"
                      rx="6"
                      fill="#991b1b"
                    />
                    <path
                      d="M231 168 h8 l4 4 v10 h-12 z"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    <text
                      x="248"
                      y="228"
                      fontSize="15"
                      fontWeight="700"
                      fill="#fff"
                      textAnchor="middle"
                    >
                      .pdf
                    </text>
                  </g>
                  <g id="lc-bp" className="part pop">
                    <circle
                      cx="282"
                      cy="242"
                      r="11"
                      fill="#fff"
                      stroke="#dc2626"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M277 242 l3.5 3.5 l6.5 -7.5"
                      fill="none"
                      stroke="#dc2626"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </g>
              </g>
            </g>

            {/* Texto dentro do círculo */}
            <g
              fontSize="13"
              fontWeight="700"
              letterSpacing=".3"
              fill="#1e293b"
              textAnchor="middle"
            >
              <text id="lc-cap1" className="cap" x="200" y="320">
                Preenchendo folha...
              </text>
              <text id="lc-cap2" className="cap" x="200" y="320">
                Gerando documento...
              </text>
              <text id="lc-cap3" className="cap" x="200" y="320">
                Arquivos prontos!
              </text>
            </g>

            {/* Indicador de etapas */}
            <g transform="translate(161, 336)">
              <rect
                id="lc-step1-dot"
                className="dot"
                x="0"
                y="0"
                width="22"
                height="6"
                rx="3"
                fill="#cbd5e1"
              />
              <rect
                id="lc-step2-dot"
                className="dot"
                x="28"
                y="0"
                width="22"
                height="6"
                rx="3"
                fill="#cbd5e1"
              />
              <rect
                id="lc-step3-dot"
                className="dot"
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
  backgroundColor: "rgba(15, 23, 42, 0.5)",
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
