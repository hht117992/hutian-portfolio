import type { CSSProperties } from "react";

const capabilities = [
  "CFD",
  "Fluent",
  "Heat Transfer",
  "Thermal Simulation",
  "Mechanical Design",
  "Experiment Setup",
  "Data Analysis",
];

export default function CapabilityOrbit() {
  return (
    <aside className="capability-orbit glass-card" aria-label="能力轨道图">
      <div className="orbit-center">
        <span>Engineering</span>
        <strong>Research</strong>
      </div>
      <div className="orbit-ring ring-a" />
      <div className="orbit-ring ring-b" />
      {capabilities.map((item, index) => (
        <span
          className="orbit-node"
          key={item}
          style={{ "--node-angle": `${index * (360 / capabilities.length)}deg` } as CSSProperties}
        >
          {item}
        </span>
      ))}
    </aside>
  );
}
