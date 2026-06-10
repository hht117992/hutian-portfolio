const metrics = [
  { value: "Master Candidate", label: "西安交通大学" },
  { value: "CFD / Fluent", label: "仿真分析" },
  { value: "Heat Transfer", label: "强化沸腾传热" },
  { value: "Experiment + Simulation", label: "实验与仿真结合" },
  { value: "Top 5%", label: "本科专业排名" },
  { value: "CET-6", label: "英语能力" },
];

export default function FloatingMetrics() {
  return (
    <div className="floating-metrics" aria-label="简历事实亮点">
      {metrics.map((item) => (
        <div className="floating-metric glass-card" key={item.value}>
          <strong>{item.value}</strong>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
