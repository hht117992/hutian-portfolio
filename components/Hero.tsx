import { ArrowDown, Mail, Radar } from "lucide-react";

import ChannelFlowDiagram from "./ChannelFlowDiagram";
import FloatingMetrics from "./FloatingMetrics";
import ResearchConsole from "./ResearchConsole";
import Reveal from "./Reveal";
import { resumeData } from "../lib/resumeData";

export default function Hero() {
  const { basicInfo } = resumeData;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  return (
    <section className="hero-section" id="home" aria-labelledby="hero-title">
      <div className="hero-media" aria-hidden="true">
        <img src={`${basePath}/research-setup.png`} alt="" />
      </div>
      <div className="hero-content">
        <Reveal className="hero-copy">
          <p className="section-kicker">Engineering Research Portfolio</p>
          <h1 id="hero-title">{basicInfo.name}</h1>
          <p className="hero-subtitle">{basicInfo.title}</p>
          <p className="hero-summary">
            西安交通大学化学工程与技术硕士研究生，研究方向聚焦强化沸腾传热与流动换热实验。具备 CFD /
            Fluent 仿真、实验模块设计、热/力学仿真、数据分析和工程验证经验，求职方向包括热管理、CFD
            仿真、化工工程、实验测试与研发工程相关岗位。
          </p>
          <div className="hero-actions">
            <a className="button primary shine-hover" href={`mailto:${basicInfo.email}`}>
              <Mail aria-hidden="true" size={18} />
              联系我
            </a>
            <a className="button secondary" href="#research">
              <Radar aria-hidden="true" size={18} />
              查看科研项目
            </a>
          </div>
          <FloatingMetrics />
          <a className="hero-scroll" href="#about" aria-label="继续浏览">
            <ArrowDown aria-hidden="true" size={18} />
          </a>
        </Reveal>
        <Reveal className="hero-console-wrap" delay={0.12}>
          <ResearchConsole />
          <ChannelFlowDiagram />
        </Reveal>
      </div>
    </section>
  );
}
