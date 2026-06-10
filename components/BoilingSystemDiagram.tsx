export default function BoilingSystemDiagram() {
  return (
    <div className="boiling-system glass-card" aria-label="强化沸腾传热系统示意图">
      <div className="diagram-title-row">
        <span>Boiling System Diagram</span>
        <strong>Experiment + Simulation</strong>
      </div>
      <svg className="boiling-svg" viewBox="0 0 620 430" role="img" aria-labelledby="boiling-title boiling-desc">
        <title id="boiling-title">强化沸腾传热系统示意图</title>
        <desc id="boiling-desc">展示微通道、流体流动、加热壁、电场线、微纳米结构、气泡成核、热流和数据采集信号。</desc>
        <defs>
          <marker id="systemArrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
            <path d="M0,0 L8,4 L0,8 Z" fill="#38bdf8" />
          </marker>
          <marker id="systemHeatArrow" markerHeight="8" markerWidth="8" orient="auto" refX="4" refY="0">
            <path d="M0,8 L4,0 L8,8 Z" fill="#f59e0b" opacity="0.9" />
          </marker>
          <linearGradient id="channelFill" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.11" />
            <stop offset="52%" stopColor="#2dd4bf" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        <rect className="system-frame" x="22" y="24" width="576" height="382" rx="14" />
        <g className="system-grid">
          {Array.from({ length: 11 }).map((_, index) => (
            <line key={`sv-${index}`} x1={74 + index * 46} y1="86" x2={74 + index * 46} y2="292" />
          ))}
          {Array.from({ length: 6 }).map((_, index) => (
            <line key={`sh-${index}`} x1="74" y1={86 + index * 38} x2="532" y2={86 + index * 38} />
          ))}
        </g>

        <rect className="system-channel" x="76" y="118" width="420" height="118" rx="12" />
        <path className="system-flow flow-a" d="M102 176 H462" markerEnd="url(#systemArrow)" />
        <path className="system-flow flow-b" d="M126 204 H438" markerEnd="url(#systemArrow)" />
        <text className="system-label" x="92" y="108">
          Working fluid flow
        </text>
        <text className="system-label" x="404" y="107">
          Micro-channel
        </text>

        <g className="nano-surface">
          {Array.from({ length: 18 }).map((_, index) => (
            <path key={index} d={`M${112 + index * 18} 238 v-14 l7 14 v-14`} />
          ))}
        </g>
        <rect className="system-wall" x="100" y="248" width="374" height="24" rx="5" />
        <text className="system-label warm" x="282" y="292" textAnchor="middle">
          Micro/nano structured surface + Heated wall
        </text>

        <g className="system-heat">
          {[138, 190, 242, 294, 346, 398, 450].map((x) => (
            <line key={x} x1={x} y1="350" x2={x} y2="278" markerEnd="url(#systemHeatArrow)" />
          ))}
        </g>
        <text className="system-label warm" x="282" y="372" textAnchor="middle">
          Thermal flux
        </text>

        <g className="field-lines">
          {[0, 1, 2, 3].map((index) => (
            <path key={index} d={`M${142 + index * 78} 74 C${118 + index * 78} 124 ${180 + index * 78} 178 ${154 + index * 78} 228`} />
          ))}
        </g>
        <text className="system-label purple" x="92" y="74">
          Electric field lines
        </text>

        <g className="nucleation-bubbles">
          <circle className="bubble bubble-one" cx="154" cy="224" r="10" />
          <circle className="bubble bubble-two" cx="236" cy="206" r="7" />
          <circle className="bubble bubble-three" cx="318" cy="218" r="12" />
          <circle className="bubble bubble-four" cx="408" cy="196" r="8" />
        </g>
        <text className="system-label cyan" x="360" y="166">
          Bubble nucleation
        </text>

        <g className="daq-panel">
          <rect x="500" y="138" width="70" height="126" rx="8" />
          <path d="M512 176 h16 l9 -22 l14 54 l8 -28 h11" />
          <path className="signal-line" d="M474 255 C504 278 492 320 548 330" />
          <text className="system-label" x="534" y="284" textAnchor="middle">
            DAQ
          </text>
        </g>
        <text className="system-label cyan" x="448" y="333">
          Data acquisition signal
        </text>
      </svg>
    </div>
  );
}
