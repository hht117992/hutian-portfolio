import { ArrowDown, Mail, Radar } from "lucide-react";

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
            西安交通大学化学工程与技术硕士研究生，聚焦强化沸腾传热、CFD
            仿真、实验模块设计与工程验证，适合传热、热管理、化工工程与科研实验相关岗位。
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
          <div className="hero-metrics" aria-label="核心亮点">
            <div>
              <strong>西安交大</strong>
              <span>硕士在读</span>
            </div>
            <div>
              <strong>405</strong>
              <span>考研成绩</span>
            </div>
            <div>
              <strong>前 5%</strong>
              <span>本科专业排名</span>
            </div>
            <div>
              <strong>CFD</strong>
              <span>仿真与工程设计</span>
            </div>
          </div>
          <a className="hero-scroll" href="#about" aria-label="继续浏览">
            <ArrowDown aria-hidden="true" size={18} />
          </a>
        </Reveal>
        <Reveal className="hero-console-wrap" delay={0.12}>
          <ResearchConsole />
        </Reveal>
      </div>
    </section>
  );
}
