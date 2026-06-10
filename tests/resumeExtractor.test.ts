import assert from "node:assert/strict";
import { test } from "node:test";
import { extractResumeData } from "../lib/resumeExtractor.ts";

test("extracts English resume sections, dates, bullets, education, experience, and projects", () => {
  const rawText = `
Alex Chen
Software Engineer
alex.chen@example.com | +1 (415) 555-0189 | San Francisco, CA
https://github.com/alexchen | https://linkedin.com/in/alexchen | alexchen.dev

Summary
Full-stack engineer focused on reliable resume parsing and portfolio generation.

Education
University of California, Berkeley | B.S. Computer Science | GPA: 3.8/4.0
Sep 2016 - May 2020
Honors: Dean's List

Work Experience
OpenAI | Software Engineer | San Francisco, CA | Jun 2022 - Present
• Built PDF resume parsing workflows with section detection.
  Reduced manual review time for hiring teams.
• Improved extraction accuracy for dates and bullet points.

Beta Labs | Backend Intern | Remote | Jan 2021 - May 2021
- Implemented API endpoints for candidate profiles.
- Added validation tests for uploaded resumes.

Projects
Resume Portfolio Generator | Lead Developer | Next.js, TypeScript, Tailwind CSS | 2024 - 2025
* Parsed PDF resumes into structured JSON.
* Added review UI before website generation.

Skills
Programming: TypeScript, Python, SQL
Frameworks: React, Next.js, Node.js
Tools: Git, Docker, AWS
Languages: English, Mandarin

Certifications
AWS Certified Developer
`;

  const resume = extractResumeData(rawText);

  assert.equal(resume.basicInfo.name, "Alex Chen");
  assert.equal(resume.basicInfo.title, "Software Engineer");
  assert.equal(resume.basicInfo.email, "alex.chen@example.com");
  assert.equal(resume.basicInfo.phone, "+1 (415) 555-0189");
  assert.equal(resume.basicInfo.location, "San Francisco, CA");
  assert.equal(resume.basicInfo.github, "https://github.com/alexchen");
  assert.equal(resume.basicInfo.linkedin, "https://linkedin.com/in/alexchen");
  assert.equal(resume.basicInfo.website, "https://alexchen.dev");
  assert.match(resume.summary ?? "", /Full-stack engineer/);

  assert.equal(resume.education.length, 1);
  assert.equal(resume.education[0].school, "University of California, Berkeley");
  assert.equal(resume.education[0].degree, "B.S.");
  assert.equal(resume.education[0].major, "Computer Science");
  assert.equal(resume.education[0].startDate, "2016-09");
  assert.equal(resume.education[0].endDate, "2020-05");
  assert.equal(resume.education[0].gpa, "3.8/4.0");
  assert.deepEqual(resume.education[0].honors, ["Dean's List"]);

  assert.equal(resume.experience.length, 2);
  assert.equal(resume.experience[0].company, "OpenAI");
  assert.equal(resume.experience[0].position, "Software Engineer");
  assert.equal(resume.experience[0].location, "San Francisco, CA");
  assert.equal(resume.experience[0].startDate, "2022-06");
  assert.equal(resume.experience[0].endDate, "Present");
  assert.deepEqual(resume.experience[0].description, [
    "Built PDF resume parsing workflows with section detection. Reduced manual review time for hiring teams.",
    "Improved extraction accuracy for dates and bullet points.",
  ]);

  assert.equal(resume.projects.length, 1);
  assert.equal(resume.projects[0].name, "Resume Portfolio Generator");
  assert.equal(resume.projects[0].role, "Lead Developer");
  assert.deepEqual(resume.projects[0].techStack, [
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
  ]);
  assert.equal(resume.projects[0].startDate, "2024");
  assert.equal(resume.projects[0].endDate, "2025");
  assert.equal(resume.projects[0].description.length, 2);

  assert.deepEqual(resume.skills.programming, ["TypeScript", "Python", "SQL"]);
  assert.deepEqual(resume.skills.frameworks, ["React", "Next.js", "Node.js"]);
  assert.deepEqual(resume.skills.tools, ["Git", "Docker", "AWS"]);
  assert.deepEqual(resume.skills.languages, ["English", "Mandarin"]);
  assert.deepEqual(resume.certifications, ["AWS Certified Developer"]);
  assert.equal(resume.rawText, rawText);
});

test("extracts Chinese resume sections, date ranges, bullets, education, work, projects, and skills", () => {
  const rawText = `
胡天
机械工程学生
hutian@example.com | 13800138000 | 上海
GitHub: https://github.com/hutian

教育经历
上海交通大学 | 机械工程 | 本科 | 2021.09 - 2025.06
GPA: 3.7/4.0

工作经历
某某科技有限公司 | 热管理实习生 | 上海 | 2024年6月 - 至今
- 搭建热管理实验数据处理流程。
- 分析换热曲线并整理周报。

项目经历
微通道流动沸腾实验平台 | 项目负责人 | Python, OpenCV, MATLAB | 2023.09-2024.05
• 设计可视化实验流程。
• 编写气泡识别脚本并输出统计结果。

技能
编程语言：Python、MATLAB、C++
工具：SolidWorks、COMSOL、Git
语言：中文、英语 CET-6
`;

  const resume = extractResumeData(rawText);

  assert.equal(resume.basicInfo.name, "胡天");
  assert.equal(resume.basicInfo.title, "机械工程学生");
  assert.equal(resume.basicInfo.email, "hutian@example.com");
  assert.equal(resume.basicInfo.phone, "13800138000");
  assert.equal(resume.basicInfo.location, "上海");
  assert.equal(resume.basicInfo.github, "https://github.com/hutian");

  assert.equal(resume.education.length, 1);
  assert.equal(resume.education[0].school, "上海交通大学");
  assert.equal(resume.education[0].major, "机械工程");
  assert.equal(resume.education[0].degree, "本科");
  assert.equal(resume.education[0].startDate, "2021-09");
  assert.equal(resume.education[0].endDate, "2025-06");
  assert.equal(resume.education[0].gpa, "3.7/4.0");

  assert.equal(resume.experience.length, 1);
  assert.equal(resume.experience[0].company, "某某科技有限公司");
  assert.equal(resume.experience[0].position, "热管理实习生");
  assert.equal(resume.experience[0].location, "上海");
  assert.equal(resume.experience[0].startDate, "2024-06");
  assert.equal(resume.experience[0].endDate, "Present");
  assert.deepEqual(resume.experience[0].description, [
    "搭建热管理实验数据处理流程。",
    "分析换热曲线并整理周报。",
  ]);

  assert.equal(resume.projects.length, 1);
  assert.equal(resume.projects[0].name, "微通道流动沸腾实验平台");
  assert.equal(resume.projects[0].role, "项目负责人");
  assert.deepEqual(resume.projects[0].techStack, ["Python", "OpenCV", "MATLAB"]);
  assert.equal(resume.projects[0].startDate, "2023-09");
  assert.equal(resume.projects[0].endDate, "2024-05");
  assert.equal(resume.projects[0].description.length, 2);

  assert.deepEqual(resume.skills.programming, ["Python", "MATLAB", "C++"]);
  assert.deepEqual(resume.skills.tools, ["SolidWorks", "COMSOL", "Git"]);
  assert.deepEqual(resume.skills.languages, ["中文", "英语 CET-6"]);
});
