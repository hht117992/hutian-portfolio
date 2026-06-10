import BoilingSystemDiagram from "./BoilingSystemDiagram";
import ResearchConsole from "./ResearchConsole";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import { resumeData } from "../lib/resumeData";

export default function ResearchProjects() {
  return (
    <section className="section" id="research" aria-labelledby="research-title">
      <SectionHeader
        id="research-title"
        eyebrow="RESEARCH PROJECT"
        title="核心科研项目"
        description="围绕微重力、电场耦合与微纳米结构强化沸腾传热，推进实验模块设计、地面验证与仿真分析。"
      />
      {resumeData.projects.map((project) => (
        <Reveal key={project.name}>
          <article className="research-card glass-card tech-grid">
            <div className="research-main">
              <div className="research-topline">
                <span>{project.role}</span>
                <span>
                  {project.startDate} - {project.endDate}
                </span>
              </div>
              <h3 className="gradient-text">{project.name}</h3>
              <div className="project-overview">
                <span>项目定位</span>
                <p>{project.overview}</p>
              </div>
              <div className="tag-list">
                {project.tags.map((tag) => (
                  <span className="tag shine-hover" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <ul className="research-list clean-list">
                {project.description.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
            <div className="research-side">
              <BoilingSystemDiagram />
              <ResearchConsole variant="project" />
            </div>
          </article>
        </Reveal>
      ))}
    </section>
  );
}
