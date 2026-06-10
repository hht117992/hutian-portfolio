import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import { resumeData } from "../lib/resumeData";

export default function Education() {
  return (
    <section className="section muted-section" id="education" aria-labelledby="education-title">
      <SectionHeader
        id="education-title"
        eyebrow="EDUCATION"
        title="教育经历"
        description="从化工基础训练到强化传热方向研究，形成工程分析与科研推进的复合背景。"
      />
      <div className="timeline">
        {resumeData.education.map((item, index) => (
          <Reveal key={item.school} delay={index * 0.06}>
            <article className={`timeline-card glass-card ${index === 0 ? "is-current" : ""}`}>
              <div className="timeline-date">
                <span>
                  {item.startDate} - {item.endDate}
                </span>
              </div>
              <div className="timeline-content">
                <h3>{item.school}</h3>
                <p className="meta">
                  {item.degree} · {item.major}
                </p>
                <ul className="clean-list">
                  {item.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
