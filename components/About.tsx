import { Atom, Cpu, FlaskConical, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import CapabilityOrbit from "./CapabilityOrbit";
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
        description="把研究方向、仿真能力、实验执行和岗位匹配度压缩成 HR 可以快速理解的能力画像。"
      />
      <div className="about-layout">
        <div className="summary-grid">
          {resumeData.summary.map((item, index) => {
            const Icon = icons[index % icons.length];

            return (
              <Reveal key={item.title} delay={index * 0.04}>
                <article className="summary-card glass-card glow-border">
                  <span className="summary-icon" aria-hidden="true">
                    <Icon size={20} />
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
        <Reveal className="about-orbit-wrap" delay={0.12}>
          <CapabilityOrbit />
        </Reveal>
      </div>
    </section>
  );
}
