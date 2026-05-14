from __future__ import annotations

import cgi
import html
import os
import re
import shutil
import sys
import traceback
import webbrowser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote

from portfolio_generator import (
    DEFAULT_TARGET_ROLE,
    ROOT,
    deploy_to_github_pages,
    extract_pdf_text,
    generate_site,
    parse_resume,
)


APP_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = ROOT / "generated_sites" / "_uploads"
SITE_DIR = ROOT / "generated_sites"


class GeneratorHandler(BaseHTTPRequestHandler):
    server_version = "PortfolioGenerator/1.0"

    def do_GET(self) -> None:
        if self.path == "/" or self.path.startswith("/?"):
            self.send_html(render_form())
            return
        if self.path.startswith("/sites/"):
            self.serve_generated_file()
            return
        self.send_error(404, "Not Found")

    def do_POST(self) -> None:
        if self.path != "/generate":
            self.send_error(404, "Not Found")
            return
        try:
            result = self.handle_generate()
            self.send_html(result)
        except Exception as error:
            detail = traceback.format_exc()
            self.send_html(render_error(str(error), detail), status=500)

    def handle_generate(self) -> str:
        form = cgi.FieldStorage(
            fp=self.rfile,
            headers=self.headers,
            environ={
                "REQUEST_METHOD": "POST",
                "CONTENT_TYPE": self.headers.get("Content-Type", ""),
                "CONTENT_LENGTH": self.headers.get("Content-Length", "0"),
            },
        )

        github_username = field_value(form, "github_username").strip()
        repo_name = safe_slug(field_value(form, "repo_name").strip() or "portfolio-site")
        target_role = field_value(form, "target_role").strip() or DEFAULT_TARGET_ROLE
        city = field_value(form, "city").strip()
        salary = field_value(form, "salary").strip()
        github_token = field_value(form, "github_token").strip()
        publish = field_value(form, "publish") == "on"
        overwrite = field_value(form, "overwrite") == "on"
        confirm_public = field_value(form, "confirm_public") == "on"

        if not github_username:
            raise ValueError("请填写 GitHub 用户名。")
        if publish and not github_token:
            raise ValueError("发布到 GitHub Pages 需要填写 GitHub Token。")
        if publish and not confirm_public:
            raise ValueError("发布到 GitHub Pages 前，请勾选公开发布确认。")

        resume_item = form["resume"] if "resume" in form else None
        if resume_item is None or not getattr(resume_item, "filename", ""):
            raise ValueError("请上传 PDF 简历。")
        resume_path = save_upload(resume_item, UPLOAD_DIR, "resume.pdf")

        project_doc_path = None
        if "project_doc" in form:
            item = form["project_doc"]
            if getattr(item, "filename", ""):
                project_doc_path = save_upload(item, UPLOAD_DIR, "project.docx")

        output_dir = SITE_DIR / repo_name
        generation = generate_site(
            resume_path=resume_path,
            github_username=github_username,
            repo_name=repo_name,
            output_dir=output_dir,
            target_role=target_role,
            city=city,
            salary=salary,
            project_doc_path=project_doc_path,
        )

        parsed = parse_resume(extract_pdf_text(resume_path), resume_path.stem)
        repo_url = ""
        pages_url = ""
        if publish:
            repo_url, pages_url = deploy_to_github_pages(
                site_dir=output_dir,
                github_username=github_username,
                repo_name=repo_name,
                user_name=parsed.name,
                user_email=parsed.email,
                github_token=github_token,
                overwrite_remote=overwrite,
            )

        local_url = f"/sites/{repo_name}/index.html"
        return render_success(
            local_url=local_url,
            output_dir=output_dir,
            repo_url=repo_url,
            pages_url=pages_url,
            warnings=generation.warnings or [],
        )

    def serve_generated_file(self) -> None:
        raw = unquote(self.path[len("/sites/") :]).split("?", 1)[0]
        target = (SITE_DIR / raw).resolve()
        if not str(target).startswith(str(SITE_DIR.resolve())):
            self.send_error(403, "Forbidden")
            return
        if target.is_dir():
            target = target / "index.html"
        if not target.exists():
            self.send_error(404, "Not Found")
            return
        content_type = guess_content_type(target)
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(target.stat().st_size))
        self.end_headers()
        with target.open("rb") as file:
            shutil.copyfileobj(file, self.wfile)

    def send_html(self, body: str, status: int = 200) -> None:
        payload = body.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)


def render_form() -> str:
    return page(
        "作品集网站生成器",
        """
        <main class="shell">
          <section class="hero">
            <p class="kicker">Portfolio Generator</p>
            <h1>上传简历，生成可发布的求职网站。</h1>
            <p>填写 GitHub 用户名和仓库名，程序会自动生成同款作品集网站；勾选发布后会推送到 GitHub Pages。</p>
          </section>
          <form class="panel" method="post" action="/generate" enctype="multipart/form-data">
            <label>
              <span>PDF 简历</span>
              <input required type="file" name="resume" accept=".pdf,application/pdf" />
            </label>
            <div class="grid">
              <label>
                <span>GitHub 用户名</span>
                <input required name="github_username" placeholder="例如 hht117992" />
              </label>
              <label>
                <span>仓库名</span>
                <input name="repo_name" value="portfolio-site" />
              </label>
            </div>
            <label>
              <span>目标岗位</span>
              <input name="target_role" value="传热 / 热管理 / CFD / 化工工程师" />
            </label>
            <div class="grid">
              <label>
                <span>期望城市</span>
                <input name="city" placeholder="例如 武汉" />
              </label>
              <label>
                <span>期望薪资</span>
                <input name="salary" placeholder="例如 12-15K" />
              </label>
            </div>
            <label>
              <span>项目文档（可选，DOCX，用于生成项目问答）</span>
              <input type="file" name="project_doc" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
            </label>
            <label>
              <span>GitHub Token（仅发布时需要，不会写入生成的网站）</span>
              <input type="password" name="github_token" placeholder="需要 repo 权限的 token" />
            </label>
            <div class="checks">
              <label><input type="checkbox" name="publish" /> 生成后发布到 GitHub Pages</label>
              <label><input type="checkbox" name="overwrite" /> 如果仓库已存在，允许覆盖 main 分支</label>
              <label><input type="checkbox" name="confirm_public" /> 我确认网站会公开简历 PDF、邮箱、电话等信息</label>
            </div>
            <button type="submit">生成网站</button>
          </form>
        </main>
        """,
    )


def render_success(local_url: str, output_dir: Path, repo_url: str, pages_url: str, warnings: list[str]) -> str:
    warning_html = "".join(f"<li>{html.escape(item)}</li>" for item in warnings)
    publish_html = ""
    if pages_url:
        publish_html = f"""
          <a class="button" href="{html.escape(pages_url)}" target="_blank">打开 GitHub Pages</a>
          <a class="button secondary" href="{html.escape(repo_url)}" target="_blank">打开 GitHub 仓库</a>
          <p class="muted">首次发布可能需要 1-2 分钟生效，遇到 404 时刷新即可。</p>
        """
    return page(
        "生成完成",
        f"""
        <main class="shell">
          <section class="panel done">
            <p class="kicker">Done</p>
            <h1>网站已生成。</h1>
            <p>输出目录：<code>{html.escape(str(output_dir))}</code></p>
            <a class="button" href="{html.escape(local_url)}" target="_blank">本地预览</a>
            {publish_html}
            {"<ul class='warnings'>" + warning_html + "</ul>" if warning_html else ""}
            <a class="back" href="/">继续生成另一个网站</a>
          </section>
        </main>
        """,
    )


def render_error(message: str, detail: str) -> str:
    return page(
        "生成失败",
        f"""
        <main class="shell">
          <section class="panel error">
            <p class="kicker">Error</p>
            <h1>生成失败</h1>
            <p>{html.escape(message)}</p>
            <details>
              <summary>查看技术细节</summary>
              <pre>{html.escape(detail)}</pre>
            </details>
            <a class="back" href="/">返回重试</a>
          </section>
        </main>
        """,
    )


def page(title: str, body: str) -> str:
    return f"""<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{html.escape(title)}</title>
  <style>
    :root {{
      --ink: #181818;
      --soft: #54504a;
      --paper: #fbfaf7;
      --panel: #ffffff;
      --line: #ded7cc;
      --accent: #e95d36;
      --blue: #2f6fd0;
      font-family: "Segoe UI", "Microsoft YaHei", Arial, sans-serif;
    }}
    * {{ box-sizing: border-box; }}
    body {{ margin: 0; background: var(--paper); color: var(--ink); line-height: 1.6; }}
    .shell {{ width: min(960px, calc(100vw - 32px)); margin: 0 auto; padding: 56px 0; }}
    .hero {{ margin-bottom: 28px; }}
    .kicker {{ margin: 0 0 10px; color: var(--accent); font-size: 12px; font-weight: 900; text-transform: uppercase; }}
    h1 {{ margin: 0 0 14px; font-size: clamp(36px, 7vw, 72px); line-height: 0.98; }}
    p {{ color: var(--soft); }}
    .panel {{ display: grid; gap: 18px; padding: clamp(20px, 4vw, 34px); border: 1px solid var(--line); border-radius: 8px; background: var(--panel); box-shadow: 0 18px 50px rgba(24, 24, 24, 0.08); }}
    label {{ display: grid; gap: 7px; font-weight: 800; }}
    label span {{ color: var(--soft); font-size: 14px; }}
    input {{ width: 100%; min-height: 46px; border: 1px solid var(--line); border-radius: 8px; padding: 10px 12px; font: inherit; }}
    input:focus {{ border-color: var(--accent); outline: 3px solid rgba(233, 93, 54, 0.18); }}
    .grid {{ display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }}
    .checks {{ display: grid; gap: 8px; padding: 12px; border-radius: 8px; background: #f3f0ea; }}
    .checks label {{ display: flex; gap: 8px; align-items: center; font-weight: 700; }}
    .checks input {{ width: auto; min-height: auto; }}
    button, .button {{ display: inline-flex; align-items: center; justify-content: center; min-height: 46px; border: 0; border-radius: 8px; padding: 10px 18px; background: var(--accent); color: #fff; font: inherit; font-weight: 900; text-decoration: none; cursor: pointer; }}
    .button.secondary {{ background: var(--blue); }}
    .back {{ color: var(--blue); font-weight: 900; }}
    code, pre {{ white-space: pre-wrap; overflow-wrap: anywhere; background: #f3f0ea; padding: 2px 5px; border-radius: 4px; }}
    pre {{ padding: 14px; }}
    .warnings {{ color: #8a4b00; }}
    .muted {{ color: var(--soft); font-size: 14px; }}
    @media (max-width: 720px) {{ .grid {{ grid-template-columns: 1fr; }} }}
  </style>
</head>
<body>{body}</body>
</html>"""


def field_value(form: cgi.FieldStorage, name: str) -> str:
    if name not in form:
        return ""
    item = form[name]
    if isinstance(item, list):
        item = item[0]
    return str(item.value or "")


def save_upload(item: cgi.FieldStorage, folder: Path, filename: str) -> Path:
    folder.mkdir(parents=True, exist_ok=True)
    path = folder / filename
    with path.open("wb") as output:
        shutil.copyfileobj(item.file, output)
    return path


def safe_slug(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r"[^a-z0-9._-]+", "-", value)
    value = value.strip("-")
    return value or "portfolio-site"


def guess_content_type(path: Path) -> str:
    suffix = path.suffix.lower()
    return {
        ".html": "text/html; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".js": "application/javascript; charset=utf-8",
        ".pdf": "application/pdf",
    }.get(suffix, "application/octet-stream")


def main() -> int:
    host = "127.0.0.1"
    port = int(os.environ.get("PORTFOLIO_GENERATOR_PORT", "8765"))
    server = ThreadingHTTPServer((host, port), GeneratorHandler)
    url = f"http://{host}:{port}/"
    print(f"作品集网站生成器已启动：{url}")
    webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n已停止。")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
