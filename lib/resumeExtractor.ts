export interface ResumeData {
  basicInfo: {
    name: string;
    title?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  summary?: string;
  education: Array<{
    school: string;
    degree?: string;
    major?: string;
    startDate?: string;
    endDate?: string;
    gpa?: string;
    honors?: string[];
  }>;
  experience: Array<{
    company: string;
    position: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    description: string[];
  }>;
  projects: Array<{
    name: string;
    role?: string;
    techStack?: string[];
    startDate?: string;
    endDate?: string;
    description: string[];
    link?: string;
  }>;
  skills: {
    programming?: string[];
    tools?: string[];
    frameworks?: string[];
    languages?: string[];
    other?: string[];
  };
  awards?: string[];
  publications?: string[];
  certifications?: string[];
  rawText: string;
}

type SectionName =
  | "header"
  | "summary"
  | "education"
  | "experience"
  | "projects"
  | "skills"
  | "awards"
  | "publications"
  | "certifications";

type DateRange = {
  startDate?: string;
  endDate?: string;
  raw: string;
};

type EntrySegment = {
  headerLines: string[];
  bodyLines: string[];
};

const MONTHS: Record<string, string> = {
  jan: "01",
  january: "01",
  feb: "02",
  february: "02",
  mar: "03",
  march: "03",
  apr: "04",
  april: "04",
  may: "05",
  jun: "06",
  june: "06",
  jul: "07",
  july: "07",
  aug: "08",
  august: "08",
  sep: "09",
  sept: "09",
  september: "09",
  oct: "10",
  october: "10",
  nov: "11",
  november: "11",
  dec: "12",
  december: "12",
};

const MONTH_PATTERN =
  "Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t|tember)?|Sept(?:ember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?";
const YEAR_PATTERN = "(?:19|20)\\d{2}";
const DATE_TOKEN_PATTERN = [
  `(?:${MONTH_PATTERN})\\.?\\s+${YEAR_PATTERN}`,
  `${YEAR_PATTERN}\\s*年\\s*(?:0?[1-9]|1[0-2])?\\s*月?`,
  `${YEAR_PATTERN}\\s*[./-]\\s*(?:0?[1-9]|1[0-2])`,
  `(?:0?[1-9]|1[0-2])\\s*[/-]\\s*${YEAR_PATTERN}`,
  YEAR_PATTERN,
  "Present",
  "Current",
  "Now",
  "Ongoing",
  "至今",
  "现在",
].join("|");

const DATE_RANGE_RE = new RegExp(
  `(${DATE_TOKEN_PATTERN})\\s*(?:-|–|—|~|至|到|to|through|until)\\s*(${DATE_TOKEN_PATTERN})`,
  "i",
);
const SINGLE_DATE_RE = new RegExp(`(${DATE_TOKEN_PATTERN})`, "i");

const SECTION_ALIASES: Array<{ name: SectionName; aliases: string[] }> = [
  {
    name: "experience",
    aliases: [
      "work experience",
      "professional experience",
      "employment experience",
      "employment history",
      "internship experience",
      "research experience",
      "experience",
      "工作经历",
      "工作经验",
      "实习经历",
      "志愿者经历",
      "志愿经历",
      "社会实践",
      "科研经历",
      "研究经历",
      "实践经历",
      "任职经历",
    ],
  },
  {
    name: "education",
    aliases: [
      "education",
      "education background",
      "academic background",
      "academic experience",
      "educational experience",
      "教育经历",
      "教育背景",
      "学历背景",
      "学业经历",
    ],
  },
  {
    name: "projects",
    aliases: [
      "projects",
      "project experience",
      "selected projects",
      "portfolio projects",
      "academic projects",
      "项目经历",
      "项目经验",
      "项目实践",
      "代表项目",
    ],
  },
  {
    name: "skills",
    aliases: [
      "skills",
      "technical skills",
      "core skills",
      "professional skills",
      "技能",
      "专业技能",
      "技术技能",
      "技能清单",
    ],
  },
  {
    name: "summary",
    aliases: [
      "summary",
      "professional summary",
      "profile",
      "objective",
      "about me",
      "personal summary",
      "personal strengths",
      "个人总结",
      "个人简介",
      "个人优势",
      "自我评价",
      "求职意向",
    ],
  },
  {
    name: "awards",
    aliases: [
      "awards",
      "honors",
      "honours",
      "awards and honors",
      "achievements",
      "获奖经历",
      "获奖情况",
      "荣誉奖项",
      "荣誉",
    ],
  },
  {
    name: "publications",
    aliases: [
      "publications",
      "papers",
      "research publications",
      "论文发表",
      "发表论文",
      "论文",
    ],
  },
  {
    name: "certifications",
    aliases: [
      "certifications",
      "certificates",
      "licenses",
      "证书",
      "资格证书",
      "认证",
      "专业认证",
    ],
  },
];

const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const EMAIL_GLOBAL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const URL_GLOBAL_RE =
  /\b(?:https?:\/\/)?(?:www\.)?[a-z0-9][a-z0-9.-]*\.[a-z]{2,}(?:\/[^\s<>)\]]*)?/gi;
const URL_TEST_RE =
  /\b(?:https?:\/\/)?(?:www\.)?[a-z0-9][a-z0-9.-]*\.[a-z]{2,}(?:\/[^\s<>)\]]*)?/i;
const PHONE_RE =
  /(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{4}(?!\d)|\b1[3-9]\d{9}\b/;
const BULLET_RE =
  /^\s*(?:[-*•●◦▪·‣⁃–—]|\d+[.)](?!\d)|[（(]\d+[）)]|[一二三四五六七八九十]+[、.])\s*/u;

const SCHOOL_RE =
  /\b(?:University|College|School|Institute|Academy|Polytechnic)\b|大学|学院|学校|研究院/i;
const DEGREE_RE =
  /\b(?:Ph\.?\s?D\.?|Doctor(?:ate)?|Master(?:'s)?|M\.?\s?S\.?|M\.?\s?A\.?|M\.?\s?Eng\.?|MBA|Bachelor(?:'s)?|B\.?\s?S\.?|B\.?\s?A\.?|B\.?\s?Eng\.?)\b|博士|硕士|研究生|本科|学士|大专|专科/i;
const POSITION_RE =
  /\b(?:Engineer|Developer|Intern|Manager|Director|Designer|Analyst|Consultant|Scientist|Assistant|Researcher|Lead|Coordinator|Specialist|Architect|Product|Operations?)\b|工程师|开发|实习|经理|主管|研究员|助理|算法|后端|前端|数据|产品|运营|负责人|成员|组长|志愿者/i;
const COMPANY_RE =
  /\b(?:Inc\.?|LLC|Ltd\.?|Limited|Corp\.?|Corporation|Company|Technologies|Technology|Labs?|Laboratory|University|Institute|Group|Studio)\b|公司|科技|集团|实验室|研究院|大学|学院|中心/i;
const LOCATION_HINT_RE =
  /\b(?:Remote|Hybrid|Onsite|[A-Z][a-z]+,\s*[A-Z]{2}|[A-Z][a-z]+,\s*[A-Z][a-z]+)\b|北京|上海|广州|深圳|杭州|南京|成都|武汉|西安|苏州|天津|重庆|远程/i;

const PROGRAMMING_SKILLS = [
  "TypeScript",
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "C#",
  "C",
  "Go",
  "Rust",
  "SQL",
  "R",
  "MATLAB",
  "CFD",
  "Fluent",
  "HTML",
  "CSS",
  "PHP",
  "Ruby",
  "Swift",
  "Kotlin",
];
const FRAMEWORK_SKILLS = [
  "React",
  "Next.js",
  "Vue",
  "Angular",
  "Node.js",
  "Express",
  "Django",
  "Flask",
  "FastAPI",
  "Spring",
  "Tailwind CSS",
  "PyTorch",
  "TensorFlow",
  "OpenCV",
  "Pandas",
  "NumPy",
];
const TOOL_SKILLS = [
  "Git",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "GCP",
  "Linux",
  "Figma",
  "Jira",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Redis",
  "SolidWorks",
  "COMSOL",
  "ANSYS",
  "AutoCAD",
  "CAD",
];
const LANGUAGE_SKILLS = [
  "English",
  "Mandarin",
  "Chinese",
  "Cantonese",
  "Japanese",
  "Korean",
  "French",
  "German",
  "Spanish",
  "中文",
  "英语",
  "普通话",
  "粤语",
  "日语",
  "韩语",
  "法语",
  "德语",
  "西班牙语",
  "CET-4",
  "CET-6",
];

export function extractResumeData(rawText: string): ResumeData {
  const lines = getResumeLines(rawText);
  const sections = splitSections(lines);
  const headerLines = getSection(sections, "header").length
    ? getSection(sections, "header")
    : lines.slice(0, 12);

  const education = parseEducation(getSection(sections, "education"));
  const experience = parseExperience(getSection(sections, "experience"));
  const projects = parseProjects(getSection(sections, "projects"));
  const skills = parseSkills(getSection(sections, "skills"));

  return {
    basicInfo: parseBasicInfo(lines, headerLines),
    summary: parseSummary(getSection(sections, "summary")),
    education,
    experience,
    projects,
    skills,
    awards: parseSimpleListSection(getSection(sections, "awards")),
    publications: parseSimpleListSection(getSection(sections, "publications")),
    certifications: parseSimpleListSection(getSection(sections, "certifications")),
    rawText,
  };
}

function normalizeResumeText(text: string): string {
  return text
    .normalize("NFKC")
    .replace(/\r/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function getResumeLines(rawText: string): string[] {
  return normalizeResumeText(rawText)
    .split("\n")
    .map((line) => compact(line))
    .filter(Boolean);
}

function splitSections(lines: string[]): Map<SectionName, string[]> {
  const sections = new Map<SectionName, string[]>();
  const ensure = (name: SectionName) => {
    if (!sections.has(name)) sections.set(name, []);
    return sections.get(name)!;
  };

  let current: SectionName = "header";
  ensure(current);

  for (const line of lines) {
    const detected = detectSection(line);
    if (detected) {
      const leadIn = popLeadInLinesForSection(ensure(current), detected);
      current = detected;
      ensure(current);
      ensure(current).push(...leadIn);
      continue;
    }

    ensure(current).push(line);
  }

  return sections;
}

function detectSection(line: string): SectionName | null {
  const trimmed = compact(line);
  if (!trimmed || trimmed.length > 80 || extractDateRange(trimmed)) return null;

  const colonIndex = trimmed.search(/[:：]/);
  if (colonIndex >= 0 && trimmed.slice(colonIndex + 1).trim()) return null;

  const normalized = normalizeSectionLabel(trimmed);
  if (!normalized || normalized.length > 40) return null;

  for (const { name, aliases } of SECTION_ALIASES) {
    for (const alias of aliases) {
      const aliasLabel = normalizeSectionLabel(alias);
      if (
        normalized === aliasLabel ||
        (normalized.includes(aliasLabel) &&
          normalized.length <= aliasLabel.length + 12)
      ) {
        return name;
      }
    }
  }

  return null;
}

function normalizeSectionLabel(label: string): string {
  return label
    .replace(/[:：]/g, "")
    .replace(/[()[\]{}]/g, "")
    .replace(/[／/]/g, " ")
    .replace(/&/g, " and ")
    .replace(/[\s._\-–—]+/g, "")
    .toUpperCase();
}

function getSection(sections: Map<SectionName, string[]>, name: SectionName): string[] {
  return sections.get(name) ?? [];
}

function popLeadInLinesForSection(lines: string[], nextSection: SectionName): string[] {
  const leadIns: string[] = [];
  while (lines.length > 0 && leadIns.length < 4) {
    const candidate = lines[lines.length - 1];
    if (!isLeadInForSection(candidate, nextSection)) break;
    leadIns.unshift(lines.pop()!);
  }
  return leadIns;
}

function isLeadInForSection(line: string, nextSection: SectionName): boolean {
  if (!line || BULLET_RE.test(line) || detectSection(line)) return false;
  const hasDate = Boolean(extractDateRange(line));

  if (nextSection === "education") {
    return hasDate || SCHOOL_RE.test(line);
  }

  if (nextSection === "experience") {
    return (
      line.length <= 120 &&
      (hasDate || POSITION_RE.test(line) || COMPANY_RE.test(line) || /支教|志愿/.test(line))
    );
  }

  if (nextSection === "projects") {
    return hasDate && line.length <= 120;
  }

  return false;
}

function parseBasicInfo(lines: string[], headerLines: string[]): ResumeData["basicInfo"] {
  const headerText = headerLines.join("\n");
  const contactText = headerText || lines.slice(0, 8).join("\n");
  const email = contactText.match(EMAIL_RE)?.[0] ?? "";
  const phone =
    headerLines
      .map((line) => line.match(PHONE_RE)?.[0] ?? "")
      .find((value) => value && !extractDateRange(value)) ?? "";
  const textWithoutEmails = contactText.replace(EMAIL_GLOBAL_RE, " ");
  const urls = Array.from(textWithoutEmails.matchAll(URL_GLOBAL_RE), (match) =>
    normalizeUrl(match[0]),
  );
  const github = urls.find((url) => /github\.com/i.test(url)) ?? "";
  const linkedin = urls.find((url) => /linkedin\.com/i.test(url)) ?? "";
  const website =
    urls.find((url) => !/github\.com|linkedin\.com/i.test(url) && !url.includes("@")) ??
    "";
  const name = findName(headerLines, lines);
  const title = findTitle(headerLines, name);

  return {
    name,
    title,
    email,
    phone,
    location: findLocation(headerLines),
    linkedin,
    github,
    website,
  };
}

function findName(headerLines: string[], allLines: string[]): string {
  const candidates = (headerLines.length ? headerLines : allLines.slice(0, 8)).filter(
    isPossibleNameLine,
  );
  return candidates[0] ?? "";
}

function isPossibleNameLine(line: string): boolean {
  const cleaned = compact(line);
  if (!cleaned || cleaned.length > 60) return false;
  if (
    EMAIL_RE.test(cleaned) ||
    PHONE_RE.test(cleaned) ||
    URL_TEST_RE.test(cleaned) ||
    detectSection(cleaned) ||
    extractDateRange(cleaned)
  ) {
    return false;
  }
  if (/[|@:/\\]/.test(cleaned) || BULLET_RE.test(cleaned)) return false;
  if (/\d/.test(cleaned)) return false;
  if (POSITION_RE.test(cleaned) && cleaned.split(/\s+/).length > 2) return false;
  return /[\p{L}\u4e00-\u9fff]/u.test(cleaned);
}

function findTitle(headerLines: string[], name: string): string {
  const expectedLine = headerLines.find((line) => /期望薪资|期望城市|期望岗位|求职意向/.test(line));
  if (expectedLine) {
    const title = splitHeaderParts(expectedLine).find((part) => !/期望/.test(part));
    if (title) return title;
  }

  const nameIndex = headerLines.findIndex((line) => line === name);
  const searchStart = nameIndex >= 0 ? nameIndex + 1 : 0;
  for (const line of headerLines.slice(searchStart, searchStart + 4)) {
    if (
      line &&
      line !== name &&
      !isDemographicLine(line) &&
      line.length <= 90 &&
      !EMAIL_RE.test(line) &&
      !PHONE_RE.test(line) &&
      !URL_TEST_RE.test(line) &&
      !detectSection(line) &&
      !extractDateRange(line)
    ) {
      return compact(line);
    }
  }
  return "";
}

function findLocation(headerLines: string[]): string {
  const expectedCity = headerLines
    .map((line) => line.match(/期望城市[:：]\s*([^|｜;；]+)/)?.[1])
    .find(Boolean);
  if (expectedCity) return compact(expectedCity);

  const labeled = headerLines
    .map((line) => line.match(/(?:Location|Address|所在地|地址)[:：]\s*(.+)$/i)?.[1])
    .find(Boolean);
  if (labeled) return compact(labeled);

  for (const line of headerLines) {
    if (!EMAIL_RE.test(line) && !PHONE_RE.test(line) && !URL_TEST_RE.test(line)) continue;
    const parts = line
      .split(/\s*(?:\||｜|•|·|;|；)\s*/)
      .map((part) => compact(part))
      .filter(Boolean);
    const location = parts.find(
      (part) =>
        !EMAIL_RE.test(part) &&
        !PHONE_RE.test(part) &&
        !URL_TEST_RE.test(part) &&
        LOCATION_HINT_RE.test(part),
    );
    if (location) return location;
  }

  return "";
}

function isDemographicLine(line: string): boolean {
  return /^(?:男|女)\s*(?:\||｜|,|，)?\s*\d{1,2}岁?$/.test(line);
}

function parseSummary(lines: string[]): string | undefined {
  const summary = compact(
    lines
      .map(cleanBullet)
      .filter((line) => !detectSection(line))
      .join(" "),
  );
  return summary || undefined;
}

function parseEducation(lines: string[]): ResumeData["education"] {
  return splitEntries(lines, "education")
    .map(parseEducationEntry)
    .filter((entry) => entry.school);
}

function parseEducationEntry(segment: EntrySegment): ResumeData["education"][number] {
  const lines = [...segment.headerLines, ...segment.bodyLines].filter(Boolean);
  const combined = lines.join(" | ");
  const dateRange = findDateRange(lines);
  const dateFreeLines = lines.map(removeDateRange);
  const schoolLine =
    dateFreeLines.find((line) => SCHOOL_RE.test(line)) ?? dateFreeLines[0] ?? "";
  const parts = splitHeaderParts(schoolLine);
  const school =
    extractSchoolName(schoolLine) ??
    parts.find((part) => SCHOOL_RE.test(part)) ??
    compact(removeDegreeAndGpa(schoolLine).split(/\s{2,}/)[0] ?? "");
  const { degree, major } = extractDegreeAndMajor(dateFreeLines, school);
  const gpa = combined.match(/(?:GPA|绩点|平均分)[:：]?\s*([0-9.]+(?:\s*\/\s*[0-9.]+)?)/i)?.[1];
  const honors = lines
    .map(cleanBullet)
    .filter((line) => /honou?rs?|dean'?s list|scholarship|award|优秀|奖学金|荣誉/i.test(line))
    .map((line) => compact(line.replace(/^Honou?rs?[:：]\s*/i, "")));

  return {
    school: compact(school),
    degree,
    major,
    startDate: dateRange?.startDate,
    endDate: dateRange?.endDate,
    gpa: gpa ? compact(gpa) : undefined,
    honors: unique(honors),
  };
}

function extractSchoolName(line: string): string | undefined {
  const match = line.match(
    /^(.+?(?:University|College|School|Institute|Academy|Polytechnic|大学|学院|学校|研究院))/i,
  );
  return match ? compact(match[1]) : undefined;
}

function extractDegreeAndMajor(
  lines: string[],
  school: string,
): { degree?: string; major?: string } {
  const joined = lines.join(" | ");
  const englishIn = joined.match(
    /\b((?:Bachelor|Master|Doctor)(?:'s)?(?: of [^|,]+?)?)\s+in\s+([^|,]+)/i,
  );
  if (englishIn) {
    return {
      degree: compact(englishIn[1]),
      major: compact(englishIn[2]),
    };
  }

  let degree = "";
  let major = "";
  for (const line of lines) {
    const dateFree = removeDateRange(line)
      .replace(school, "")
      .replace(/(?:GPA|绩点|平均分)[:：]?\s*[0-9.]+(?:\s*\/\s*[0-9.]+)?/gi, "");
    const parts = splitHeaderParts(dateFree).filter(Boolean);

    for (const part of parts) {
      const degreeMatch = part.match(DEGREE_RE)?.[0];
      if (degreeMatch && !degree) degree = normalizeDegree(degreeMatch);
      const withoutDegree = compact(part.replace(DEGREE_RE, "").replace(/^[.,，。]\s*/, ""));
      if (
        withoutDegree &&
        !major &&
        !SCHOOL_RE.test(withoutDegree) &&
        !/honou?rs?|award|奖学金|荣誉/i.test(withoutDegree)
      ) {
        major = withoutDegree.replace(/^in\s+/i, "");
      }
    }
  }

  return {
    degree: degree || undefined,
    major: major || undefined,
  };
}

function parseExperience(lines: string[]): ResumeData["experience"] {
  return splitEntries(lines, "experience")
    .map(parseExperienceEntry)
    .filter((entry) => entry.company || entry.position);
}

function parseExperienceEntry(segment: EntrySegment): ResumeData["experience"][number] {
  const header = segment.headerLines.join(" | ");
  const dateRange = findDateRange(segment.headerLines) ?? findDateRange(segment.bodyLines);
  const headerWithoutDate = compact(removeDateRange(header));
  const parts = splitExperienceHeaderParts(headerWithoutDate);
  const positionIndex = parts.findIndex((part) => POSITION_RE.test(part));
  const companyIndex = parts.findIndex((part) => COMPANY_RE.test(part));
  const locationIndex = parts.findIndex((part) => LOCATION_HINT_RE.test(part));

  let company = "";
  let position = "";
  let location = "";

  if (companyIndex >= 0) company = parts[companyIndex];
  if (positionIndex >= 0) position = parts[positionIndex];
  if (locationIndex >= 0) location = parts[locationIndex];

  if ((!company || !position) && parts.length >= 2) {
    if (positionIndex === 0) {
      position = position || parts[0];
      company = company || parts[1];
    } else if (positionIndex > 0) {
      company = company || parts[0];
      position = position || parts[positionIndex];
    } else {
      company = company || parts[0];
      position = position || parts[1];
    }
  }

  if (parts.length === 1) {
    const paired = splitCompanyAndPosition(parts[0]);
    if (paired.company && paired.position) {
      company = paired.company;
      position = paired.position;
    }
  }

  if ((!company || !position) && parts.length === 1 && /支教|志愿/.test(parts[0])) {
    company = compact(parts[0].replace(/\s*\d+\s*月$/, ""));
    position =
      segment.bodyLines.join(" ").match(/担任[^，。]*(支教老师)/)?.[1] ??
      "志愿者";
  }

  return {
    company: compact(company),
    position: compact(position),
    location: compact(location),
    startDate: dateRange?.startDate,
    endDate: dateRange?.endDate,
    description: collectDescriptions(segment.bodyLines),
  };
}

function splitCompanyAndPosition(text: string): { company: string; position: string } {
  const match = text.match(
    /^(.+?)\s+([^|\s]{2,24}(?:Engineer|Developer|Intern|Manager|Director|Designer|Analyst|Consultant|Scientist|Assistant|Researcher|工程师|实习生|经理|主管|研究员|助理|负责人|志愿者))$/i,
  );
  return {
    company: match ? compact(match[1]) : "",
    position: match ? compact(match[2]) : "",
  };
}

function parseProjects(lines: string[]): ResumeData["projects"] {
  return splitEntries(lines, "projects")
    .map(parseProjectEntry)
    .filter((entry) => entry.name);
}

function parseProjectEntry(segment: EntrySegment): ResumeData["projects"][number] {
  const allLines = [...segment.headerLines, ...segment.bodyLines];
  const header = segment.headerLines.join(" | ");
  const dateRange = findDateRange(segment.headerLines) ?? findDateRange(segment.bodyLines);
  const link = allLines.join(" ").match(URL_GLOBAL_RE)?.[0];
  const headerWithoutDate = removeDateRange(header).replace(link ?? "", "");
  const parts = splitHeaderParts(headerWithoutDate).filter(Boolean);
  const inferred = parts.length === 1 ? inferProjectNameAndRole(parts) : {};
  const role =
    extractLabeledValue(headerWithoutDate, ["Role", "Position", "职责", "角色"]) ??
    inferred.role ??
    parts.find((part) => isRoleLike(part));
  const techStack = extractTechStack(allLines);
  const name =
    inferred.name ??
    parts.find(
      (part) =>
        part !== role &&
        !isTechStackLike(part) &&
        !/^项目[:：]|^Project[:：]/i.test(part),
    ) ?? "";

  return {
    name: compact(name.replace(/^Project[:：]\s*/i, "").replace(/^项目[:：]\s*/, "")),
    role: role ? compact(stripLabel(role)) : undefined,
    techStack,
    startDate: dateRange?.startDate,
    endDate: dateRange?.endDate,
    description: collectDescriptions(segment.bodyLines),
    link: link ? normalizeUrl(link) : undefined,
  };
}

function inferProjectNameAndRole(parts: string[]): { name?: string; role?: string } {
  for (const part of parts) {
    const match = part.match(
      /^(.+?)\s+((?:第一|第二|主要)?(?:负责人|成员|组长|参与者|开发者|Researcher|Developer|Lead))$/i,
    );
    if (match) {
      return {
        name: compact(match[1]),
        role: compact(match[2]),
      };
    }
  }
  return {};
}

function parseSkills(lines: string[]): ResumeData["skills"] {
  const result: Required<ResumeData["skills"]> = {
    programming: [],
    tools: [],
    frameworks: [],
    languages: [],
    other: [],
  };

  for (const line of lines.map(cleanBullet).filter(Boolean)) {
    const labelMatch = line.match(/^([^:：]{2,32})[:：]\s*(.+)$/);
    if (labelMatch) {
      const category = skillCategoryFromLabel(labelMatch[1]);
      for (const item of splitList(labelMatch[2])) {
        addSkill(result, item, category);
      }
      continue;
    }

    for (const item of splitList(line)) {
      addSkill(result, item);
    }
  }

  return Object.fromEntries(
    Object.entries(result)
      .map(([key, value]) => [key, unique(value)])
      .filter(([, value]) => (value as string[]).length > 0),
  ) as ResumeData["skills"];
}

function parseSimpleListSection(lines: string[]): string[] {
  return collectDescriptions(lines).length
    ? collectDescriptions(lines)
    : lines.map(cleanBullet).map(compact).filter(Boolean);
}

function splitEntries(
  lines: string[],
  kind: "education" | "experience" | "projects",
): EntrySegment[] {
  const entries: EntrySegment[] = [];
  let current: EntrySegment | null = null;

  for (const rawLine of lines) {
    const line = compact(rawLine);
    if (!line) continue;

    const isHeader = looksEntryHeader(line, kind);
    if (isHeader && current && current.bodyLines.length === 0) {
      if (
        kind === "education" &&
        SCHOOL_RE.test(current.headerLines.join(" ")) &&
        SCHOOL_RE.test(line)
      ) {
        entries.push(current);
        current = { headerLines: [line], bodyLines: [] };
        continue;
      }
      current.headerLines.push(line);
      continue;
    }

    if (isHeader) {
      if (current) entries.push(current);
      current = { headerLines: [line], bodyLines: [] };
      continue;
    }

    if (!current) {
      current = { headerLines: [line], bodyLines: [] };
      continue;
    }

    if (
      current.bodyLines.length === 0 &&
      current.headerLines.length < 4 &&
      shouldTreatAsHeaderContinuation(line, kind)
    ) {
      current.headerLines.push(line);
    } else {
      current.bodyLines.push(line);
    }
  }

  if (current) entries.push(current);
  return entries;
}

function looksEntryHeader(
  line: string,
  kind: "education" | "experience" | "projects",
): boolean {
  if (BULLET_RE.test(line) || detectSection(line)) return false;
  if (extractDateRange(line)) return true;

  if (kind === "education") return SCHOOL_RE.test(line);
  if (kind === "experience") {
    return (
      line.length <= 120 &&
      !/[.!?。！？]$/.test(line) &&
      (POSITION_RE.test(line) || COMPANY_RE.test(line) || /[|｜]/.test(line))
    );
  }

  return (
    line.length <= 140 &&
    !/[.!?。！？]$/.test(line) &&
    (/[|｜]/.test(line) || isTechStackLike(line) || isRoleLike(line))
  );
}

function shouldTreatAsHeaderContinuation(
  line: string,
  kind: "education" | "experience" | "projects",
): boolean {
  if (BULLET_RE.test(line) || detectSection(line)) return false;
  if (line.length > 140 || /[.!?。！？]$/.test(line)) return false;
  if (extractDateRange(line)) return true;
  if (kind === "education") return SCHOOL_RE.test(line) || DEGREE_RE.test(line) || /GPA|绩点/i.test(line);
  if (kind === "experience") return POSITION_RE.test(line) || COMPANY_RE.test(line) || LOCATION_HINT_RE.test(line);
  return isRoleLike(line) || isTechStackLike(line) || Boolean(extractLabeledValue(line, ["Tech Stack", "Technologies", "技术栈"]));
}

function findDateRange(lines: string[]): DateRange | undefined {
  for (const line of lines) {
    const range = extractDateRange(line);
    if (range) return range;
  }

  return undefined;
}

function extractDateRange(line: string): DateRange | undefined {
  const rangeMatch = line.match(DATE_RANGE_RE);
  if (rangeMatch) {
    return {
      startDate: normalizeDate(rangeMatch[1]),
      endDate: normalizeDate(rangeMatch[2]),
      raw: rangeMatch[0],
    };
  }

  const singleMatch = line.match(SINGLE_DATE_RE);
  if (singleMatch && /(Expected|Graduat|毕业|入学|开始|结束)/i.test(line)) {
    return {
      endDate: normalizeDate(singleMatch[1]),
      raw: singleMatch[0],
    };
  }

  return undefined;
}

function normalizeDate(token: string): string {
  const cleaned = compact(token).replace(/[.,，。;；]$/g, "");
  if (/^(Present|Current|Now|Ongoing|至今|现在)$/i.test(cleaned)) return "Present";

  const chinese = cleaned.match(/^((?:19|20)\d{2})\s*年\s*(0?[1-9]|1[0-2])?\s*月?$/);
  if (chinese) return chinese[2] ? `${chinese[1]}-${pad2(chinese[2])}` : chinese[1];

  const yearMonth = cleaned.match(/^((?:19|20)\d{2})\s*[./-]\s*(0?[1-9]|1[0-2])$/);
  if (yearMonth) return `${yearMonth[1]}-${pad2(yearMonth[2])}`;

  const monthYear = cleaned.match(/^(0?[1-9]|1[0-2])\s*[/-]\s*((?:19|20)\d{2})$/);
  if (monthYear) return `${monthYear[2]}-${pad2(monthYear[1])}`;

  const english = cleaned.match(new RegExp(`^(${MONTH_PATTERN})\\.?\\s+(${YEAR_PATTERN})$`, "i"));
  if (english) {
    const month = MONTHS[english[1].toLowerCase().replace(/\.$/, "")];
    return month ? `${english[2]}-${month}` : cleaned;
  }

  return cleaned;
}

function normalizeDegree(value: string): string {
  const compacted = compact(value).replace(/\s+/g, "");
  const upper = compacted.toUpperCase().replace(/\./g, "");
  const abbreviations: Record<string, string> = {
    BS: "B.S.",
    BA: "B.A.",
    MS: "M.S.",
    MA: "M.A.",
    MENG: "M.Eng.",
    BENG: "B.Eng.",
    PHD: "Ph.D.",
  };
  return abbreviations[upper] ?? compact(value);
}

function removeDateRange(line: string): string {
  return compact(line.replace(DATE_RANGE_RE, " ").replace(/\s*(?:\||｜|,|，|;|；)\s*$/g, ""));
}

function cleanBullet(line: string): string {
  return compact(line.replace(BULLET_RE, ""));
}

function collectDescriptions(lines: string[]): string[] {
  const descriptions: string[] = [];

  for (const line of lines.map(compact).filter(Boolean)) {
    if (BULLET_RE.test(line)) {
      descriptions.push(cleanBullet(line));
      continue;
    }

    if (descriptions.length > 0 && !looksEntryHeader(line, "experience")) {
      descriptions[descriptions.length - 1] = compact(
        `${descriptions[descriptions.length - 1]} ${line}`,
      );
    } else if (!detectSection(line)) {
      descriptions.push(cleanBullet(line));
    }
  }

  return unique(descriptions.filter(Boolean));
}

function splitHeaderParts(text: string): string[] {
  return text
    .split(/\s*(?:\||｜|•|·|;|；|\t| - | – | — )\s*/)
    .map((part) => compact(stripLabel(part)))
    .filter(Boolean);
}

function splitExperienceHeaderParts(text: string): string[] {
  const primary = splitHeaderParts(text);
  if (primary.length > 1) return primary;
  return text
    .split(/\s*,\s*/)
    .map((part) => compact(stripLabel(part)))
    .filter(Boolean);
}

function splitList(text: string): string[] {
  return text
    .split(/\s*(?:,|，|;|；|、|\||｜)\s*/)
    .map((item) => compact(item))
    .filter(Boolean);
}

function extractTechStack(lines: string[]): string[] | undefined {
  const all = lines.join(" | ");
  const labeled = extractLabeledValue(all, [
    "Tech Stack",
    "Technologies",
    "Technology",
    "Stack",
    "技术栈",
    "技术",
  ]);
  const candidates = labeled
    ? splitList(labeled)
    : splitHeaderParts(all)
        .filter(isTechStackLike)
        .flatMap(splitList);
  const uniqueCandidates = unique(candidates.map(stripLabel).map(compact).filter(Boolean));
  return uniqueCandidates.length ? uniqueCandidates : undefined;
}

function extractLabeledValue(text: string, labels: string[]): string | undefined {
  for (const label of labels) {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = text.match(new RegExp(`${escaped}\\s*[:：]\\s*([^|；;]+)`, "i"));
    if (match?.[1]) return compact(match[1]);
  }
  return undefined;
}

function isRoleLike(text: string): boolean {
  return /^(?:Role|Position|职责|角色)[:：]/i.test(text) || POSITION_RE.test(text);
}

function isTechStackLike(text: string): boolean {
  const known = [...PROGRAMMING_SKILLS, ...FRAMEWORK_SKILLS, ...TOOL_SKILLS].some((skill) =>
    containsKnownSkillToken(text, skill),
  );
  return (
    known ||
    /^(?:Tech Stack|Technologies|Technology|Stack|技术栈|技术)[:：]/i.test(text) ||
    /(?:\.js|OpenCV|MATLAB|Python|React|Vue|Docker|Git|SQL|C\+\+)/i.test(text)
  );
}

function addSkill(
  result: Required<ResumeData["skills"]>,
  rawItem: string,
  forcedCategory?: keyof ResumeData["skills"],
): void {
  const item = compact(rawItem);
  if (!item) return;
  if (!forcedCategory) {
    const extracted = extractKnownSkills(item);
    if (extracted.length > 0) {
      for (const skill of extracted) {
        result[classifySkill(skill)].push(skill);
      }
      return;
    }
  }
  const category = forcedCategory ?? classifySkill(item);
  result[category].push(item);
}

function extractKnownSkills(item: string): string[] {
  const aliases: Array<[string, string]> = [
    ["Python", "Python"],
    ["C\\+\\+", "C++"],
    ["C语言", "C"],
    ["\\bC\\b", "C"],
    ["CFD", "CFD"],
    ["Ansys", "ANSYS"],
    ["SolidWorks", "SolidWorks"],
    ["AutoCAD", "AutoCAD"],
    ["CAD", "CAD"],
    ["Fluent", "Fluent"],
    ["MATLAB", "MATLAB"],
  ];
  const found: string[] = [];
  for (const [pattern, canonical] of aliases) {
    if (new RegExp(pattern, "i").test(item)) found.push(canonical);
  }
  return unique(found);
}

function classifySkill(item: string): keyof ResumeData["skills"] {
  if (includesKnownSkill(item, PROGRAMMING_SKILLS)) return "programming";
  if (includesKnownSkill(item, FRAMEWORK_SKILLS)) return "frameworks";
  if (includesKnownSkill(item, TOOL_SKILLS)) return "tools";
  if (includesKnownSkill(item, LANGUAGE_SKILLS)) return "languages";
  return "other";
}

function skillCategoryFromLabel(label: string): keyof ResumeData["skills"] | undefined {
  if (/programming|languages?\s*\(?(?:coding|dev)|编程|编程语言|开发语言/i.test(label)) {
    return "programming";
  }
  if (/framework|library|libraries|框架|库/i.test(label)) return "frameworks";
  if (/tool|platform|software|工具|平台|软件/i.test(label)) return "tools";
  if (/language|语言|外语/i.test(label)) return "languages";
  if (/other|additional|其他/i.test(label)) return "other";
  return undefined;
}

function includesKnownSkill(item: string, skills: string[]): boolean {
  const normalized = item.toLowerCase();
  return skills.some((skill) => normalized === skill.toLowerCase());
}

function containsKnownSkillToken(text: string, skill: string): boolean {
  const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^A-Za-z0-9+#.])${escaped}(?=$|[^A-Za-z0-9+#.])`, "i").test(
    text,
  );
}

function stripLabel(text: string): string {
  return compact(
    text.replace(
      /^(?:Role|Position|Tech Stack|Technologies|Technology|Stack|Project|职责|角色|技术栈|技术|项目)[:：]\s*/i,
      "",
    ),
  );
}

function removeDegreeAndGpa(text: string): string {
  return compact(
    text
      .replace(DEGREE_RE, "")
      .replace(/(?:GPA|绩点|平均分)[:：]?\s*[0-9.]+(?:\s*\/\s*[0-9.]+)?/gi, ""),
  );
}

function normalizeUrl(url: string): string {
  const cleaned = url.replace(/[),.;，。；]+$/g, "");
  return /^https?:\/\//i.test(cleaned) ? cleaned : `https://${cleaned}`;
}

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items.filter(Boolean)));
}

function pad2(value: string): string {
  return value.padStart(2, "0");
}

function compact(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}
