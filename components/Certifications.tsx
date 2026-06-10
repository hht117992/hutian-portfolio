import { BadgeCheck } from "lucide-react";

import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import { resumeData } from "../lib/resumeData";

export default function Certifications() {
  return (
    <section className="section compact-section" aria-labelledby="certifications-title">
      <SectionHeader id="certifications-title" eyebrow="CERTIFICATIONS" title="证书" />
      <div className="cert-list">
        {resumeData.certifications.map((item, index) => (
          <Reveal key={item} delay={index * 0.04}>
            <span className="cert-badge glass-card">
              <BadgeCheck aria-hidden="true" size={17} />
              {item}
            </span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
