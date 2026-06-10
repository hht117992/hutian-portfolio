"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ChangeEvent } from "react";

import Reveal from "./Reveal";

type SliderControlProps = {
  id: string;
  label: string;
  max: number;
  min: number;
  step?: number;
  unit?: string;
  value: number;
  onChange: (value: number) => void;
};

type ModuleNodeProps = {
  className?: string;
  label: string;
  subtitle: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

function SliderControl({ id, label, max, min, onChange, step = 1, unit, value }: SliderControlProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(Number(event.target.value));
  }

  return (
    <label className="system-control" htmlFor={id}>
      <span>
        {label}
        <strong>
          {value.toFixed(step < 1 ? 2 : 0)}
          {unit ? ` ${unit}` : ""}
        </strong>
      </span>
      <input id={id} max={max} min={min} onChange={handleChange} step={step} type="range" value={value} />
    </label>
  );
}

function ModuleNode({ className = "", height, label, subtitle, title, width, x, y }: ModuleNodeProps) {
  return (
    <g className={`system-node ${className}`} transform={`translate(${x} ${y})`}>
      <title>{title}</title>
      <rect width={width} height={height} rx="10" />
      <text className="node-label" x={width / 2} y={height / 2 - 3} textAnchor="middle">
        {label}
      </text>
      <text className="node-subtitle" x={width / 2} y={height / 2 + 17} textAnchor="middle">
        {subtitle}
      </text>
    </g>
  );
}

export default function ExperimentalSystemDemo() {
  const [flowRate, setFlowRate] = useState(0.3);
  const [heatingPower, setHeatingPower] = useState(120);
  const [coolingLevel, setCoolingLevel] = useState(3);
  const [daqEnabled, setDaqEnabled] = useState(true);

  const flowDuration = Math.max(2.2, 6.2 - flowRate * 6.2);
  const heatStrength = heatingPower / 300;
  const coolingStrength = coolingLevel / 5;
  const coolingOpacity = 0.34 + coolingStrength * 0.56;
  const heatOpacity = 0.34 + heatStrength * 0.56;
  const heatArrowCount = useMemo(() => Math.max(3, Math.round(heatingPower / 55)), [heatingPower]);

  const style = {
    "--cool-opacity": coolingOpacity.toFixed(2),
    "--cool-strength": coolingStrength.toFixed(2),
    "--flow-duration": `${flowDuration.toFixed(2)}s`,
    "--heat-opacity": heatOpacity.toFixed(2),
    "--heat-strength": heatStrength.toFixed(2),
  } as CSSProperties;

  return (
    <section className="section experimental-system-section" id="experimental-system-demo" aria-labelledby="experimental-system-title">
      <Reveal>
        <div className="section-heading">
          <p className="section-kicker">EXPERIMENTAL SYSTEM DEMO</p>
          <h2 id="experimental-system-title">闭式循环实验系统示意</h2>
          <p className="section-description">
            以流动沸腾实验闭式循环回路为对象，展示储液、驱动、流量控制、预热、测试段加热、冷凝冷却和数据采集系统之间的关系，用于体现实验系统设计与测试流程理解。
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <div className="experimental-system-card glass-card" style={style}>
          <div className="system-visual-panel">
            <div className="system-panel-heading">
              <span>Experimental Loop Visualizer</span>
              <strong>Closed-loop Boiling System</strong>
            </div>
            <svg className="experimental-loop-svg" viewBox="0 0 920 560" role="img" aria-labelledby="loop-title loop-desc">
              <title id="loop-title">闭式循环流动沸腾实验系统示意图</title>
              <desc id="loop-desc">
                展示储液罐、循环泵、流量计、预热器、测试段、加热模块、冷凝器、冷却器、DAQ 和上位机之间的闭式循环、冷却回路与数据采集关系。
              </desc>
              <defs>
                <marker id="loopArrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
                  <path d="M0,0 L8,4 L0,8 Z" fill="#38bdf8" />
                </marker>
                <marker id="coolingArrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
                  <path d="M0,0 L8,4 L0,8 Z" fill="#60a5fa" />
                </marker>
                <marker id="heatInputArrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
                  <path d="M0,0 L8,4 L0,8 Z" fill="#f59e0b" />
                </marker>
              </defs>

              <g className="system-backdrop-grid">
                {Array.from({ length: 12 }).map((_, index) => (
                  <line key={`v-${index}`} x1={60 + index * 68} x2={60 + index * 68} y1="52" y2="490" />
                ))}
                {Array.from({ length: 7 }).map((_, index) => (
                  <line key={`h-${index}`} x1="52" x2="860" y1={74 + index * 62} y2={74 + index * 62} />
                ))}
              </g>

              <path className="loop-pipe main-pipe" d="M146 380 H246 V152 H355 H492 H624 H742 V380 H168" markerEnd="url(#loopArrow)" />
              <path className="loop-pipe main-pipe secondary" d="M166 410 H784 V132 H146 V348" markerEnd="url(#loopArrow)" />

              <ModuleNode height={72} label="Reservoir" subtitle="储液罐" title="Reservoir / 储液罐" width={128} x={82} y={344} />
              <ModuleNode height={66} label="Pump" subtitle="循环泵" title="Pump / 循环泵" width={112} x={220} y={344} />
              <ModuleNode className="meter-node" height={64} label="Flow Meter" subtitle="流量计" title="Flow Meter / 流量计" width={128} x={348} y={344} />
              <ModuleNode height={66} label="Preheater" subtitle="预热器" title="Preheater / 预热器" width={128} x={514} y={344} />
              <ModuleNode className="test-section-node" height={82} label="Test Section" subtitle="测试段" title="Test Section / 测试段" width={154} x={575} y={114} />
              <ModuleNode className="condenser-node" height={72} label="Condenser" subtitle="冷凝器" title="Condenser / 冷凝器" width={136} x={716} y={344} />
              <ModuleNode className="heating-node" height={64} label="Heating Module" subtitle="加热模块" title="Heating Module / 加热模块" width={150} x={576} y={238} />
              <ModuleNode className="chiller-node" height={68} label="Chiller" subtitle="冷却器" title="Chiller / 冷却器" width={122} x={734} y={448} />
              <ModuleNode className="daq-node" height={80} label="DAQ" subtitle="数据采集系统" title="Data Acquisition System / 数据采集系统" width={130} x={328} y={96} />
              <ModuleNode className="computer-node" height={70} label="Computer" subtitle="上位机" title="Computer / 上位机" width={130} x={116} y={96} />

              <g className="cooling-loop">
                <path d="M794 448 V420" markerEnd="url(#coolingArrow)" />
                <path d="M810 420 V448" markerEnd="url(#coolingArrow)" />
                <path d="M785 448 C728 476 704 422 739 410" markerEnd="url(#coolingArrow)" />
              </g>

              <g className="heat-input-lines">
                {Array.from({ length: heatArrowCount }).map((_, index) => (
                  <line key={index} markerEnd="url(#heatInputArrow)" x1={606 + index * 24} x2={606 + index * 24} y1="236" y2="202" />
                ))}
              </g>

              <g className={`daq-lines ${daqEnabled ? "is-online" : "is-offline"}`}>
                <path d="M393 176 C428 160 484 148 575 152" />
                <path d="M393 176 C470 188 520 188 575 182" />
                <path d="M393 176 C360 246 392 314 412 344" />
                <path d="M393 176 C482 222 558 244 618 238" />
                <path d="M328 136 H246" />
              </g>

              <g className="measurement-points">
                <g transform="translate(586 104)">
                  <circle r="8" />
                  <text>T</text>
                </g>
                <g transform="translate(716 104)">
                  <circle r="8" />
                  <text>P</text>
                </g>
                <g transform="translate(348 334)">
                  <circle r="8" />
                  <text>F</text>
                </g>
                <g transform="translate(724 252)">
                  <circle r="8" />
                  <text>Q</text>
                </g>
              </g>

              <text className="loop-caption" x="88" y="62">
                Closed-loop flow path: Reservoir → Pump → Flow Meter → Preheater → Test Section → Condenser → Reservoir
              </text>
              <text className="signal-caption" x="302" y="80">
                DAQ signals: T / P / F / Q
              </text>
            </svg>
          </div>

          <div className="system-side-panel">
            <div className="system-status-panel glass-card">
              <div className="system-panel-heading">
                <span>System Status Panel</span>
                <strong>{daqEnabled ? "DAQ Online" : "DAQ Offline"}</strong>
              </div>
              <dl className="system-status-grid">
                <div>
                  <dt>Flow Rate</dt>
                  <dd>{flowRate.toFixed(2)} m/s</dd>
                </div>
                <div>
                  <dt>Heating Power</dt>
                  <dd>{heatingPower} W</dd>
                </div>
                <div>
                  <dt>Cooling Level</dt>
                  <dd>Level {coolingLevel}</dd>
                </div>
                <div>
                  <dt>DAQ Status</dt>
                  <dd>{daqEnabled ? "Online" : "Offline"}</dd>
                </div>
                <div>
                  <dt>Test Section</dt>
                  <dd>Active</dd>
                </div>
                <div>
                  <dt>Signals</dt>
                  <dd>Temperature / Pressure / Flow / Power</dd>
                </div>
                <div>
                  <dt>Loop Type</dt>
                  <dd>Closed-loop boiling system</dd>
                </div>
              </dl>
              <p>
                该 Demo 为闭式循环流动沸腾实验系统的前端示意，用于展示实验回路、测试段加热、冷却回路和数据采集逻辑，不连接真实硬件。
              </p>
            </div>

            <div className="system-controls glass-card">
              <SliderControl id="system-flow-rate" label="Flow Rate" max={0.6} min={0.1} onChange={setFlowRate} step={0.05} unit="m/s" value={flowRate} />
              <SliderControl id="system-heating-power" label="Heating Power" max={300} min={50} onChange={setHeatingPower} unit="W" value={heatingPower} />
              <SliderControl id="system-cooling-level" label="Cooling Level" max={5} min={1} onChange={setCoolingLevel} value={coolingLevel} />
              <label className="system-toggle">
                <span>
                  DAQ Enabled
                  <strong>{daqEnabled ? "Online" : "Offline"}</strong>
                </span>
                <input checked={daqEnabled} onChange={(event) => setDaqEnabled(event.target.checked)} type="checkbox" />
                <i aria-hidden="true" />
              </label>
            </div>
          </div>

          <div className="system-explanation">
            <p>
              闭式循环流动沸腾实验系统通常由储液、驱动、流量测量、预热、测试段加热、冷凝冷却和数据采集等部分组成。该示意图用于展示实验系统搭建与测试流程：工质在循环泵驱动下流经测试段，测试段由加热模块提供热输入，冷凝器与冷却器维持回路热平衡，DAQ 采集温度、压力、流量和加热功率等信号，用于后续换热性能分析。
            </p>
            <p className="system-boundary-note">
              注：该 Demo 为作品集交互式实验系统示意，设备布局和参数变化为前端可视化表达，不代表真实实验系统的完整设计图或安全校核。
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
