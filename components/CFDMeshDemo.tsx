"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ChangeEvent } from "react";

import Reveal from "./Reveal";

const meshDensityRange = { min: 8, max: 36, defaultValue: 18 };
const inletVelocityRange = { min: 0.1, max: 0.5, defaultValue: 0.3, step: 0.05 };
const boundaryLayerRange = { min: 1, max: 5, defaultValue: 3 };

const channel = {
  x: 88,
  y: 94,
  width: 560,
  height: 184,
};

function createInteriorLines(count: number, start: number, length: number): number[] {
  return Array.from({ length: count }, (_, index) => start + ((index + 1) * length) / (count + 1));
}

function formatVelocity(value: number): string {
  return value.toFixed(2);
}

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

function SliderControl({ id, label, max, min, step = 1, unit, value, onChange }: SliderControlProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(Number(event.target.value));
  }

  return (
    <label className="cfd-control" htmlFor={id}>
      <span>
        {label}
        <strong>
          {unit ? `${formatVelocity(value)} ${unit}` : value}
        </strong>
      </span>
      <input id={id} max={max} min={min} onChange={handleChange} step={step} type="range" value={value} />
    </label>
  );
}

export default function CFDMeshDemo() {
  const [meshDensity, setMeshDensity] = useState(meshDensityRange.defaultValue);
  const [inletVelocity, setInletVelocity] = useState(inletVelocityRange.defaultValue);
  const [boundaryLayer, setBoundaryLayer] = useState(boundaryLayerRange.defaultValue);
  const [heatedWall, setHeatedWall] = useState(true);

  const horizontalLines = Math.round(meshDensity / 3);
  const estimatedCells = meshDensity * horizontalLines;
  const verticalLinePositions = useMemo(
    () => createInteriorLines(meshDensity, channel.x, channel.width),
    [meshDensity],
  );
  const horizontalLinePositions = useMemo(
    () => createInteriorLines(horizontalLines, channel.y, channel.height),
    [horizontalLines],
  );
  const boundaryLayerPositions = useMemo(
    () =>
      Array.from(
        { length: boundaryLayer },
        (_, index) => channel.y + channel.height - 12 - index * (10 / Math.max(boundaryLayer - 1, 1)),
      ),
    [boundaryLayer],
  );
  const refinementVerticalLines = useMemo(
    () => createInteriorLines(Math.max(6, Math.round(meshDensity / 2)), 300, 190),
    [meshDensity],
  );
  const refinementHorizontalLines = useMemo(
    () => createInteriorLines(Math.max(4, boundaryLayer + 2), 178, 72),
    [boundaryLayer],
  );
  const flowStyle = { "--flow-duration": `${Math.max(2.1, 4.2 - inletVelocity * 4.2)}s` } as CSSProperties;

  return (
    <section className="section cfd-demo-section" id="cfd-demo" aria-labelledby="cfd-demo-title">
      <Reveal>
        <div className="section-heading">
          <p className="section-kicker">CFD MESH DEMO</p>
          <h2 id="cfd-demo-title">CFD 网格划分演示</h2>
          <p className="section-description">
            以矩形微通道为对象，模拟 CFD
            前处理中的网格密度调节、近壁面边界层加密、入口速度设置与加热壁面边界条件配置，用于展示工程建模与
            Fluent 前处理思路。
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <div className="cfd-demo-card glass-card">
          <div className="cfd-visual-panel">
            <div className="cfd-panel-topline">
              <span>Rectangular Micro-channel</span>
              <strong>Pre-processing Visualization</strong>
            </div>
            <svg
              className={`cfd-mesh-svg ${heatedWall ? "heated-enabled" : "heated-disabled"}`}
              role="img"
              aria-labelledby="cfd-svg-title cfd-svg-desc"
              viewBox="0 0 760 430"
            >
              <title id="cfd-svg-title">CFD 网格划分示意图</title>
              <desc id="cfd-svg-desc">
                交互式展示矩形微通道网格、边界层加密、局部加密区、入口速度和加热壁面边界条件。
              </desc>
              <defs>
                <marker id="cfdFlowArrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
                  <path d="M0,0 L8,4 L0,8 Z" fill="#38bdf8" />
                </marker>
                <marker id="cfdHeatArrow" markerHeight="8" markerWidth="8" orient="auto" refX="4" refY="0">
                  <path d="M0,8 L4,0 L8,8 Z" fill="#f59e0b" />
                </marker>
                <clipPath id="cfdChannelClip">
                  <rect x={channel.x} y={channel.y} width={channel.width} height={channel.height} rx="10" />
                </clipPath>
              </defs>

              <g className="cfd-backdrop-grid">
                {createInteriorLines(13, 42, 676).map((x) => (
                  <line key={`bg-v-${x}`} x1={x} x2={x} y1="38" y2="360" />
                ))}
                {createInteriorLines(7, 48, 288).map((y) => (
                  <line key={`bg-h-${y}`} x1="42" x2="718" y1={y} y2={y} />
                ))}
              </g>

              <rect className="cfd-channel-outline" x={channel.x} y={channel.y} width={channel.width} height={channel.height} rx="10" />
              <g className="cfd-mesh-lines" clipPath="url(#cfdChannelClip)">
                {verticalLinePositions.map((x) => (
                  <line key={`mesh-v-${x}`} x1={x} x2={x} y1={channel.y} y2={channel.y + channel.height} />
                ))}
                {horizontalLinePositions.map((y) => (
                  <line key={`mesh-h-${y}`} x1={channel.x} x2={channel.x + channel.width} y1={y} y2={y} />
                ))}
              </g>

              <rect className="cfd-refinement-zone" x="300" y="178" width="190" height="72" rx="8" />
              <g className="cfd-refinement-lines" clipPath="url(#cfdChannelClip)">
                {refinementVerticalLines.map((x) => (
                  <line key={`refine-v-${x}`} x1={x} x2={x} y1="178" y2="250" />
                ))}
                {refinementHorizontalLines.map((y) => (
                  <line key={`refine-h-${y}`} x1="300" x2="490" y1={y} y2={y} />
                ))}
              </g>
              <text className="cfd-svg-label cyan" x="395" y="170" textAnchor="middle">
                Refinement Zone
              </text>

              <g className="cfd-boundary-layer">
                {boundaryLayerPositions.map((y) => (
                  <line key={`bl-${y}`} x1={channel.x + 10} x2={channel.x + channel.width - 10} y1={y} y2={y} />
                ))}
              </g>
              <text className="cfd-svg-label" x="626" y="304" textAnchor="end">
                Boundary layer mesh
              </text>

              <path className="cfd-inlet-arrow" d="M28 186 H78" markerEnd="url(#cfdFlowArrow)" />
              <path className="cfd-outlet-arrow" d="M655 186 H724" markerEnd="url(#cfdFlowArrow)" />
              <text className="cfd-svg-label cyan" x="50" y="170" textAnchor="middle">
                Inlet
              </text>
              <text className="cfd-svg-label cyan" x="694" y="170" textAnchor="middle">
                Outlet
              </text>

              <g className="cfd-flow-arrows" style={flowStyle}>
                {[148, 250, 352, 454].map((x) => (
                  <path key={x} d={`M${x} 186 h70`} markerEnd="url(#cfdFlowArrow)" />
                ))}
              </g>

              <rect className="cfd-heated-wall" x="146" y="282" width="444" height="24" rx="6" />
              <text className={`cfd-svg-label warm ${heatedWall ? "" : "muted"}`} x="368" y="326" textAnchor="middle">
                Heated Wall
              </text>

              <g className="cfd-heat-flux">
                {[188, 248, 308, 368, 428, 488, 548].map((x) => (
                  <line key={x} x1={x} x2={x} y1="382" y2="318" markerEnd="url(#cfdHeatArrow)" />
                ))}
              </g>
              <text className={`cfd-svg-label warm ${heatedWall ? "" : "muted"}`} x="368" y="404" textAnchor="middle">
                Thermal Flux Boundary
              </text>
            </svg>
          </div>

          <div className="cfd-side-panel">
            <div className="cfd-readout glass-card">
              <div className="cfd-panel-topline">
                <span>Pre-processing Panel</span>
                <strong>Fluent / CFD</strong>
              </div>
              <dl className="cfd-readout-grid">
                <div>
                  <dt>Mesh Density</dt>
                  <dd>{meshDensity}</dd>
                </div>
                <div>
                  <dt>Estimated Cells</dt>
                  <dd>{estimatedCells}</dd>
                </div>
                <div>
                  <dt>Inlet Velocity</dt>
                  <dd>{formatVelocity(inletVelocity)} m/s</dd>
                </div>
                <div>
                  <dt>Boundary Layer</dt>
                  <dd>Level {boundaryLayer}</dd>
                </div>
                <div>
                  <dt>Heated Wall</dt>
                  <dd>{heatedWall ? "Enabled" : "Disabled"}</dd>
                </div>
                <div>
                  <dt>Solver Context</dt>
                  <dd>Fluent / CFD Pre-processing</dd>
                </div>
              </dl>
              <p className="cfd-note">
                该 Demo 为 CFD 前处理可视化演示，展示网格密度、近壁面加密和边界条件设置思路，不进行真实数值求解。
              </p>
            </div>

            <div className="cfd-controls glass-card">
              <SliderControl
                id="mesh-density"
                label="Mesh Density"
                max={meshDensityRange.max}
                min={meshDensityRange.min}
                onChange={setMeshDensity}
                value={meshDensity}
              />
              <SliderControl
                id="inlet-velocity"
                label="Inlet Velocity"
                max={inletVelocityRange.max}
                min={inletVelocityRange.min}
                onChange={setInletVelocity}
                step={inletVelocityRange.step}
                unit="m/s"
                value={inletVelocity}
              />
              <SliderControl
                id="boundary-layer"
                label="Boundary Layer"
                max={boundaryLayerRange.max}
                min={boundaryLayerRange.min}
                onChange={setBoundaryLayer}
                value={boundaryLayer}
              />
              <label className="cfd-toggle">
                <span>
                  Heated Wall
                  <strong>{heatedWall ? "Enabled" : "Disabled"}</strong>
                </span>
                <input checked={heatedWall} onChange={(event) => setHeatedWall(event.target.checked)} type="checkbox" />
                <i aria-hidden="true" />
              </label>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
