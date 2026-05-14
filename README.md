# 胡昊天求职作品集与网站生成器

这个项目包含两部分：

- 当前已上线的个人求职作品集网站。
- `portfolio_generator/`：一个本地网站生成器，可以上传 PDF 简历并生成同款作品集网站。

## 当前网站

直接打开 `index.html` 可以本地预览。网站内容主要在 `data.js` 中维护，简历 PDF 位于 `assets/resume.pdf`。

线上地址：

```text
https://hht117992.github.io/hutian-portfolio/
```

## 生成器用法

双击运行：

```text
portfolio_generator\run_generator.bat
```

浏览器会打开本地页面。上传 PDF 简历、填写 GitHub 用户名和仓库名后即可生成新网站；如果勾选发布到 GitHub Pages，程序会尝试自动创建仓库、推送文件并开启 Pages。

命令行方式：

```powershell
python portfolio_generator\portfolio_generator.py --resume "C:\path\resume.pdf" --github your-github-name --repo portfolio-site --deploy
```

## 注意

发布到 GitHub Pages 后，网站、简历 PDF、邮箱和电话会公开，请确认可以对外展示。
