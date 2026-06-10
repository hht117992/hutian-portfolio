import { Atom, Cpu, FlaskConical, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import { resumeData } from "../lib/resumeData";

const icons: LucideIcon[] = [Sparkles, Atom, Cpu, FlaskConical];

export default function About() {
  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <SectionHeader
        id="about-title"
        eyebrow="ABOUT"
        title="关于我"
        description="以化学工程与传热强化为研究主线，兼具实验设计、仿真分析与工程实现能力。"
      />
      <div className="summary-grid">
        {resumeData.summary.map((item, index) => {
          const Icon = icons[index % icons.length];

          return (
            <Reveal key={item} delay={index * 0.04}>
              <article className="summary-card glass-card glow-border">
                <span className="summary-icon" aria-hidden="true">
                  <Icon size={20} />
                </span>
                <p>{item}</p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
