import { Mail, MapPin, Phone } from "lucide-react";

import Reveal from "./Reveal";
import { resumeData } from "../lib/resumeData";

export default function Contact() {
  const { basicInfo } = resumeData;

  return (
    <section className="section contact-section" id="contact" aria-labelledby="contact-title">
      <Reveal>
        <div className="contact-panel glass-card tech-grid">
        <div>
          <p className="section-kicker">CONTACT</p>
          <h2 id="contact-title">联系方式</h2>
          <p>欢迎联系我交流传热强化、CFD 仿真、实验平台搭建、化工工程与热管理相关岗位机会。</p>
        </div>
        <div className="contact-list">
          <a className="contact-chip" href={`mailto:${basicInfo.email}`}>
            <Mail aria-hidden="true" size={18} />
            <span>邮箱</span>
            <strong className="contact-value email-value">{basicInfo.email}</strong>
          </a>
          <a className="contact-chip" href={`tel:${basicInfo.phone}`}>
            <Phone aria-hidden="true" size={18} />
            <span>电话</span>
            <strong>{basicInfo.phone}</strong>
          </a>
          <div className="contact-chip">
            <MapPin aria-hidden="true" size={18} />
            <span>城市</span>
            <strong>{basicInfo.location}</strong>
          </div>
        </div>
        </div>
      </Reveal>
    </section>
  );
}
