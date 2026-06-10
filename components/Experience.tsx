import { BriefcaseBusiness } from "lucide-react";

import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import { resumeData } from "../lib/resumeData";

export default function Experience() {
  return (
    <section className="section muted-section" id="experience" aria-labelledby="experience-title">
      <SectionHeader
        id="experience-title"
        eyebrow="EXPERIENCE"
        title="实习与实践经历"
        description="通过化工现场实习与公益实践，补足工程现场认知、沟通协作与任务执行经验。"
      />
      <div className="card-grid two-column">
        {resumeData.experience.map((item, index) => (
          <Reveal key={item.company} delay={index * 0.05}>
            <article className="info-card glass-card glow-border">
              <div className="card-icon" aria-hidden="true">
                <BriefcaseBusiness size={18} />
              </div>
              <p className="period">
                {item.startDate} - {item.endDate}
              </p>
              <h3>{item.company}</h3>
              <p className="meta">{item.position}</p>
              <ul className="clean-list">
                {item.description.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
