"use client";

import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";

import Reveal from "./Reveal";

type FluidType = "Water" | "Ethanol" | "FC-72" | "Custom";
type SurfaceType = "Smooth Surface" | "Micro/Nano Structured Surface" | "Electric Field Coupled Surface";

type SliderControlProps = {
  id: string;
  label: string;
  max: number;
  min: number;
  step?: number;
  unit: string;
  value: number;
  onChange: (value: number) => void;
};

type SelectControlProps<T extends string> = {
  id: string;
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
};

type ThermalRegime = {
  label: string;
  description: string;
  tone: "invalid" | "low" | "moderate" | "high" | "extreme";
};

const fluidTypes = ["Water", "Ethanol", "FC-72", "Custom"] as const;
const surfaceTypes = ["Smooth Surface", "Micro/Nano Structured Surface", "Electric Field Coupled Surface"] as const;

const kinematicViscosity: Record<FluidType, number> = {
  Water: 0.36e-6,
  Ethanol: 0.7e-6,
  "FC-72": 0.4e-6,
  Custom: 0.5e-6,
};

const hydraulicDiameter = 2e-3;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function formatNumber(value: number | null, digits: number): string {
  return value === null || Number.isNaN(value) ? "--" : value.toFixed(digits);
}

function getThermalRegime(heatFlux: number, wallSuperheat: number): ThermalRegime {
  if (wallSuperheat <= 0) {
    return {
      label: "Invalid Temperature Condition",
      description: "壁面温度需高于饱和温度，才能形成有效过热度。",
      tone: "invalid",
    };
  }

  if (heatFlux < 10) {
    return {
      label: "Low Heat Flux",
      description: "热流密度较低，可能处于低负荷加热或弱沸腾工况。",
      tone: "low",
    };
  }

  if (heatFlux < 50) {
    return {
      label: "Moderate Boiling Range",
      description: "热流密度处于中等范围，可用于观察沸腾起始和换热增强趋势。",
      tone: "moderate",
    };
  }

  if (heatFlux < 100) {
    return {
      label: "High Heat Flux",
      description: "热流密度较高，需要关注壁温响应、气泡行为和局部干涸风险。",
      tone: "high",
    };
  }

  return {
    label: "Extreme Heat Flux",
    description: "热流密度很高，仅作为演示工况，需要关注 CHF、局部干涸和温度异常风险。",
    tone: "extreme",
  };
}

function getSurfaceHint(surfaceType: SurfaceType): string {
  if (surfaceType === "Smooth Surface") {
    return "光滑表面通常更依赖流动对流和自然成核点分布，换热增强能力有限。";
  }

  if (surfaceType === "Electric Field Coupled Surface") {
    return "电场耦合可能影响气泡脱离、界面扰动和液体补给过程，可作为强化沸腾传热的调控手段。";
  }

  return "微纳米结构表面可增加成核位点并改善润湿特性，通常有助于强化沸腾换热。";
}

function SliderControl({ id, label, max, min, onChange, step = 1, unit, value }: SliderControlProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(Number(event.target.value));
  }

  return (
    <label className="heat-control" htmlFor={id}>
      <span>
        {label}
        <strong>
          {value.toFixed(step < 1 ? 2 : 1)} {unit}
        </strong>
      </span>
      <input id={id} max={max} min={min} onChange={handleChange} step={step} type="range" value={value} />
    </label>
  );
}

function SelectControl<T extends string>({ id, label, onChange, options, value }: SelectControlProps<T>) {
  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    onChange(event.target.value as T);
  }

  return (
    <label className="heat-control heat-select-control" htmlFor={id}>
      <span>{label}</span>
      <select id={id} onChange={handleChange} value={value}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function HeatTransferCalculator() {
  const [heatingPower, setHeatingPower] = useState(120);
  const [heatingArea, setHeatingArea] = useState(2.5);
  const [wallTemperature, setWallTemperature] = useState(105);
  const [saturationTemperature, setSaturationTemperature] = useState(80);
  const [flowVelocity, setFlowVelocity] = useState(0.3);
  const [fluidType, setFluidType] = useState<FluidType>("Water");
  const [surfaceType, setSurfaceType] = useState<SurfaceType>("Micro/Nano Structured Surface");

  const results = useMemo(() => {
    const heatFlux = heatingPower / heatingArea;
    const wallSuperheat = wallTemperature - saturationTemperature;
    const apparentHtc = wallSuperheat > 0 ? heatFlux / wallSuperheat : null;
    const apparentHtcSI = apparentHtc === null ? null : apparentHtc * 10000;
    // Simplified Reynolds estimate for portfolio visualization only.
    // The viscosity and hydraulic diameter are approximations, not rigorous property calculations.
    const reynolds = (flowVelocity * hydraulicDiameter) / kinematicViscosity[fluidType];
    const regime = getThermalRegime(heatFlux, wallSuperheat);
    const surfaceHint = getSurfaceHint(surfaceType);

    return {
      apparentHtc,
      apparentHtcSI,
      heatFlux,
      reynolds,
      regime,
      surfaceHint,
      wallSuperheat,
    };
  }, [flowVelocity, fluidType, heatingArea, heatingPower, saturationTemperature, surfaceType, wallTemperature]);

  const chartPoint = {
    x: 52 + (clamp(results.wallSuperheat, 0, 80) / 80) * 254,
    y: 170 - (clamp(results.heatFlux, 0, 120) / 120) * 126,
  };
  const bubbleCount = clamp(Math.round(results.heatFlux / 18) + 3, 3, 9);
  const isInvalid = results.wallSuperheat <= 0;
  const isHighFlux = results.heatFlux >= 50;

  return (
    <section className="section heat-transfer-section" id="heat-transfer-demo" aria-labelledby="heat-transfer-title">
      <Reveal>
        <div className="section-heading">
          <p className="section-kicker">HEAT TRANSFER DEMO</p>
          <h2 id="heat-transfer-title">沸腾传热参数计算器</h2>
          <p className="section-description">
            基于加热功率、加热面积、壁面温度与饱和温度，快速估算热流密度、壁面过热度和表观换热系数，并通过趋势图展示实验工况变化对换热性能的影响。
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <div className="heat-demo-card glass-card">
          <div className="heat-input-panel glass-card">
            <div className="heat-panel-heading">
              <span>Input Parameters</span>
              <strong>Experiment Data</strong>
            </div>
            <p className="heat-demo-copy">
              该 Demo 用于展示沸腾传热实验中的基础数据处理流程。通过输入加热功率、加热面积、壁面温度和饱和温度，可估算热流密度、壁面过热度和表观换热系数，并结合流速与简化 Reynolds 数观察工况变化趋势。
            </p>
            <div className="heat-controls">
              <SliderControl id="heating-power" label="Heating Power" max={300} min={20} onChange={setHeatingPower} unit="W" value={heatingPower} />
              <SliderControl id="heating-area" label="Heating Area" max={10} min={0.5} onChange={setHeatingArea} step={0.1} unit="cm²" value={heatingArea} />
              <SliderControl id="wall-temperature" label="Wall Temperature" max={180} min={60} onChange={setWallTemperature} unit="℃" value={wallTemperature} />
              <SliderControl
                id="saturation-temperature"
                label="Saturation Temperature"
                max={120}
                min={40}
                onChange={setSaturationTemperature}
                unit="℃"
                value={saturationTemperature}
              />
              <SliderControl id="flow-velocity" label="Flow Velocity" max={0.6} min={0.1} onChange={setFlowVelocity} step={0.05} unit="m/s" value={flowVelocity} />
              <SelectControl id="fluid-type" label="Fluid Type" onChange={setFluidType} options={fluidTypes} value={fluidType} />
              <SelectControl id="surface-type" label="Surface Type" onChange={setSurfaceType} options={surfaceTypes} value={surfaceType} />
            </div>
          </div>

          <div className="heat-visual-panel">
            <div className="heat-chart glass-card">
              <div className="heat-panel-heading">
                <span>Boiling Performance Trend</span>
                <strong>q'' vs ΔT</strong>
              </div>
              <svg className="heat-chart-svg" viewBox="0 0 360 220" role="img" aria-labelledby="trend-title trend-desc">
                <title id="trend-title">热流密度与壁面过热度趋势图</title>
                <desc id="trend-desc">展示简化的热流密度随壁面过热度增加而上升的趋势，以及当前工况点。</desc>
                <g className="heat-chart-grid">
                  {[52, 103, 154, 205, 256, 307].map((x) => (
                    <line key={`x-${x}`} x1={x} x2={x} y1="38" y2="170" />
                  ))}
                  {[44, 75, 106, 138, 170].map((y) => (
                    <line key={`y-${y}`} x1="52" x2="306" y1={y} y2={y} />
                  ))}
                </g>
                <path className="trend-axis" d="M52 32 V170 H318" />
                <path className="trend-curve" d="M52 160 C98 146 118 126 150 106 C190 72 234 62 306 44" />
                <text className="heat-axis-label" x="176" y="204" textAnchor="middle">
                  Wall Superheat ΔT
                </text>
                <text className="heat-axis-label vertical" x="16" y="118" textAnchor="middle">
                  Heat Flux q''
                </text>
                {isInvalid ? (
                  <text className="invalid-state-label" x="180" y="112" textAnchor="middle">
                    Invalid temperature condition
                  </text>
                ) : (
                  <g className="current-point">
                    <circle cx={chartPoint.x} cy={chartPoint.y} r="7" />
                    <text x={chartPoint.x + 12} y={chartPoint.y - 10}>
                      Current Point
                    </text>
                  </g>
                )}
              </svg>
            </div>

            <div className={`boiling-visualizer glass-card ${isHighFlux ? "is-warning" : ""}`}>
              <div className="heat-panel-heading">
                <span>Boiling Surface Visualizer</span>
                <strong>{surfaceType}</strong>
              </div>
              <svg className="boiling-visual-svg" viewBox="0 0 360 240" role="img" aria-labelledby="surface-title surface-desc">
                <title id="surface-title">沸腾表面示意图</title>
                <desc id="surface-desc">展示加热壁面、液体区域、气泡、热流箭头、微结构和电场耦合示意。</desc>
                <defs>
                  <marker id="surfaceHeatArrow" markerHeight="8" markerWidth="8" orient="auto" refX="4" refY="0">
                    <path d="M0,8 L4,0 L8,8 Z" fill="#f59e0b" />
                  </marker>
                </defs>
                <rect className="liquid-region" x="32" y="34" width="296" height="142" rx="12" />
                <rect className="surface-wall" x="44" y="174" width="272" height="20" rx="5" />
                {surfaceType !== "Smooth Surface" ? (
                  <g className="surface-structures">
                    {Array.from({ length: 18 }).map((_, index) => (
                      <path key={index} d={`M${55 + index * 14} 174 v-12 l6 12 v-12`} />
                    ))}
                  </g>
                ) : null}
                {surfaceType === "Electric Field Coupled Surface" ? (
                  <g className="surface-field-lines">
                    {[0, 1, 2, 3].map((index) => (
                      <path key={index} d={`M${82 + index * 58} 30 C${60 + index * 58} 72 ${104 + index * 58} 118 ${82 + index * 58} 164`} />
                    ))}
                  </g>
                ) : null}
                <g className="surface-bubbles">
                  {Array.from({ length: bubbleCount }).map((_, index) => {
                    const x = 70 + (index % 5) * 50 + (index > 4 ? 26 : 0);
                    const y = 150 - (index % 3) * 30 - Math.floor(index / 5) * 12;
                    const radius = clamp(6 + results.heatFlux / 24 + (index % 3), 6, 15);
                    return <circle key={index} cx={x} cy={y} r={radius} />;
                  })}
                </g>
                <g className="surface-heat-flux">
                  {[78, 124, 170, 216, 262].map((x) => (
                    <line key={x} markerEnd="url(#surfaceHeatArrow)" x1={x} x2={x} y1="226" y2="198" />
                  ))}
                </g>
                <text className="surface-label" x="180" y="216" textAnchor="middle">
                  Heat Flux Boundary
                </text>
              </svg>
            </div>
          </div>

          <div className="heat-results-panel glass-card">
            <div className="heat-panel-heading">
              <span>Results Panel</span>
              <strong>{results.regime.label}</strong>
            </div>
            <div className="heat-results-grid">
              <div>
                <span>Heat Flux q''</span>
                <strong className="gradient-text">{formatNumber(results.heatFlux, 2)} W/cm²</strong>
              </div>
              <div>
                <span>Wall Superheat ΔT</span>
                <strong>{formatNumber(results.wallSuperheat, 1)} K</strong>
              </div>
              <div>
                <span>Apparent HTC h</span>
                <strong>{formatNumber(results.apparentHtc, 3)} W/(cm²·K)</strong>
              </div>
              <div>
                <span>HTC in SI Units</span>
                <strong>{formatNumber(results.apparentHtcSI, 0)} W/(m²·K)</strong>
              </div>
              <div>
                <span>Estimated Reynolds Number</span>
                <strong>{formatNumber(results.reynolds, 0)}</strong>
              </div>
              <div className={`thermal-regime ${results.regime.tone}`}>
                <span>Thermal Regime</span>
                <strong>{results.regime.label}</strong>
                <p>{results.regime.description}</p>
              </div>
            </div>
            <div className="surface-hint">
              <span>Surface Enhancement Hint</span>
              <p>{results.surfaceHint}</p>
            </div>
            <p className="heat-boundary-note">
              注：该计算器为作品集交互式演示，物性参数和流动模型经过简化，仅用于展示传热实验数据处理思路，不作为工程设计依据。
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
