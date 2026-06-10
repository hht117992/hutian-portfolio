export default function ChannelFlowDiagram() {
  return (
    <div className="channel-flow-card glass-card" aria-label="微通道流动示意图">
      <div className="diagram-title-row">
        <span>Micro-channel Flow</span>
        <strong>Flow + Heat Flux</strong>
      </div>
      <svg className="channel-flow-svg" viewBox="0 0 520 230" role="img" aria-labelledby="channel-title channel-desc">
        <title id="channel-title">微通道流动示意图</title>
        <desc id="channel-desc">展示入口、出口、加热壁、气泡、热流箭头和 CFD 网格线。</desc>
        <defs>
          <linearGradient id="channelFlow" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.16" />
            <stop offset="50%" stopColor="#2dd4bf" stopOpacity="0.26" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.12" />
          </linearGradient>
          <marker id="flowArrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
            <path d="M0,0 L8,4 L0,8 Z" fill="#38bdf8" />
          </marker>
          <marker id="heatArrow" markerHeight="8" markerWidth="8" orient="auto" refX="4" refY="0">
            <path d="M0,8 L4,0 L8,8 Z" fill="#f59e0b" opacity="0.9" />
          </marker>
        </defs>

        <g className="cfd-grid">
          {Array.from({ length: 10 }).map((_, index) => (
            <line key={`v-${index}`} x1={70 + index * 38} y1="48" x2={70 + index * 38} y2="148" />
          ))}
          {Array.from({ length: 5 }).map((_, index) => (
            <line key={`h-${index}`} x1="70" y1={48 + index * 25} x2="442" y2={48 + index * 25} />
          ))}
        </g>

        <rect className="channel-body" x="70" y="48" width="372" height="100" rx="8" />
        <rect className="heated-wall" x="104" y="150" width="304" height="18" rx="4" />
        <text className="diagram-label" x="256" y="181" textAnchor="middle">
          Heated Wall
        </text>

        <path className="flow-line flow-a" d="M94 98 H420" markerEnd="url(#flowArrow)" />
        <path className="flow-line flow-b" d="M112 123 H396" markerEnd="url(#flowArrow)" />
        <text className="diagram-label cyan" x="50" y="103" textAnchor="end">
          Inlet
        </text>
        <text className="diagram-label cyan" x="464" y="103">
          Outlet
        </text>

        <g className="heat-flux">
          {[124, 172, 220, 268, 316, 364].map((x) => (
            <line key={x} x1={x} y1="212" x2={x} y2="172" markerEnd="url(#heatArrow)" />
          ))}
        </g>
        <text className="diagram-label warm" x="256" y="224" textAnchor="middle">
          Thermal Flux
        </text>

        <g className="micro-bubbles">
          <circle className="bubble bubble-one" cx="150" cy="132" r="8" />
          <circle className="bubble bubble-two" cx="218" cy="118" r="6" />
          <circle className="bubble bubble-three" cx="306" cy="128" r="9" />
          <circle className="bubble bubble-four" cx="372" cy="106" r="5" />
        </g>
      </svg>
    </div>
  );
}
