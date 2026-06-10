import { ChartNoAxesCombined, FlaskConical, PenTool, TerminalSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import { resumeData } from "../lib/resumeData";

const iconMap: Record<string, LucideIcon> = {
  编程与数据处理: TerminalSquare,
  仿真分析: ChartNoAxesCombined,
  工程设计: PenTool,
  科研能力: FlaskConical,
};

export default function Skills() {
  return (
    <section className="section" id="skills" aria-labelledby="skills-title">
      <SectionHeader
        id="skills-title"
        eyebrow="SKILLS MATRIX"
        title="技能结构"
        description="覆盖编程处理、CFD / Fluent 仿真、工程设计软件与科研实验推进能力。"
      />
      <div className="card-grid">
        {resumeData.skills.map((group, index) => {
          const Icon = iconMap[group.category] ?? TerminalSquare;
          const isSimulation = group.category.includes("仿真");

          return (
            <Reveal key={group.category} delay={index * 0.04}>
              <article className={`skill-card glass-card ${isSimulation ? "is-highlighted" : ""}`}>
                <div className="skill-card-head">
                  <span className="card-icon" aria-hidden="true">
                    <Icon size={18} />
                  </span>
                  <h3>{group.category}</h3>
                </div>
                <div className="tag-list">
                  {group.items.map((item) => (
                    <span className="tag shine-hover" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
