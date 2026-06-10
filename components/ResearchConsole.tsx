type ResearchConsoleProps = {
  variant?: "hero" | "project";
};

const heroRows = [
  ["Focus", "Boiling Heat Transfer"],
  ["Simulation", "CFD / Fluent"],
  ["Research", "Microgravity + Electric Field"],
  ["Tools", "ANSYS / SolidWorks / CAD"],
  ["Status", "Experimental Validation"],
];

const projectRows = [
  ["Role", "第二负责人"],
  ["Period", "2024.10 - 至今"],
  ["Domain", "Boiling Heat Transfer"],
  ["Methods", "Experiment + Simulation"],
  ["Tools", "CFD / Fluent / Thermal Simulation"],
];

export default function ResearchConsole({ variant = "hero" }: ResearchConsoleProps) {
  const rows = variant === "hero" ? heroRows : projectRows;

  return (
    <aside className={`research-console ${variant === "project" ? "compact" : ""}`}>
      <div className="console-topbar">
        <span className="console-light active" />
        <span className="console-light" />
        <span className="console-light purple" />
        <strong>Research Console</strong>
      </div>
      <div className="console-display">
        <div className="console-diagram">
          <span className="diagram-ring ring-one" />
          <span className="diagram-ring ring-two" />
          <span className="diagram-core" />
          <span className="diagram-axis axis-x" />
          <span className="diagram-axis axis-y" />
        </div>
        <div className="console-readout">
          {rows.map(([label, value]) => (
            <div className="console-row" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
        <div className="console-scanline" />
      </div>
    </aside>
  );
}
