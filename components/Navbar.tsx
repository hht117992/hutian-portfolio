import { resumeData } from "../lib/resumeData";

const navItems = [
  { label: "关于", href: "#about" },
  { label: "教育", href: "#education" },
  { label: "科研项目", href: "#research" },
  { label: "实践", href: "#experience" },
  { label: "技能", href: "#skills" },
  { label: "联系", href: "#contact" },
];

export default function Navbar() {
  return (
    <header className="site-header">
      <a className="brand" href="#home" aria-label="回到首页">
        <span className="brand-mark" aria-hidden="true">
          H
        </span>
        <span className="brand-text">{resumeData.basicInfo.name}</span>
      </a>
      <nav className="site-nav" aria-label="主导航">
        {navItems.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
