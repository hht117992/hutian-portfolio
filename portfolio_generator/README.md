# 作品集网站生成器

这个小程序可以根据 PDF 简历生成同款求职作品集网站，并可选发布到 GitHub Pages。

## 图形界面用法

1. 双击 `portfolio_generator/run_generator.bat`。
2. 浏览器会打开本地页面。
3. 上传 PDF 简历，填写 GitHub 用户名和仓库名。
4. 可选上传 DOCX 项目文档，用于生成项目问答知识库。
5. 勾选“发布到 GitHub Pages”后，会自动创建/推送仓库并开启 Pages。

## 命令行用法

```powershell
python portfolio_generator\portfolio_generator.py ^
  --resume "C:\path\resume.pdf" ^
  --github your-github-name ^
  --repo portfolio-site ^
  --deploy
```

如果仓库已存在并确认要覆盖 main 分支，可以加 `--force`。

## 注意

- 发布到 GitHub Pages 会公开网页、简历 PDF、邮箱和电话。
- 第一次发布后 GitHub Pages 可能需要 1-2 分钟生效。
- 如果 PDF 无法提取文本，程序会生成基础版本，之后可手动编辑输出目录里的 `data.js`。
