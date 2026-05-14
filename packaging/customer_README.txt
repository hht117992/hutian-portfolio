作品集网站生成器 - 便携版

使用方式

1. 解压整个文件夹。
2. 双击 PortfolioGenerator.exe。
3. 浏览器会自动打开本地页面。
4. 上传 PDF 简历，填写 GitHub 用户名、仓库名、目标岗位等信息。
5. 点击“生成网站”。
6. 如果勾选“发布到 GitHub Pages”，需要填写 GitHub Token，并确认公开发布。

生成结果

- 本地生成的网站会保存在程序旁边的 generated_sites 文件夹中。
- 发布成功后，会显示 GitHub Pages 网址，可发给 HR 或其他人访问。
- 首次发布后，GitHub Pages 可能需要 1-2 分钟生效。

GitHub Token 提醒

GitHub 用户名不能直接创建仓库或上传文件，发布网站需要 Token 授权。
推荐使用 Fine-grained personal access token，并授予 Contents 读写、Pages 读写、Metadata 读取权限。
也可以使用 classic token，并勾选 repo 权限。

隐私提醒

发布到 GitHub Pages 后，网页、简历 PDF、邮箱、电话等内容会公开。
请在发布前确认简历和联系方式可以对外展示。

常见问题

1. 浏览器没有自动打开：
   手动访问 http://127.0.0.1:8765/

2. 生成内容不够准确：
   PDF 简历的排版会影响自动提取效果。生成后可以编辑输出目录中的 data.js。

3. 发布失败：
   检查 GitHub Token 权限是否足够，GitHub 用户名是否和 Token 所属账号一致。

4. 关闭程序：
   关闭 PortfolioGenerator.exe 打开的黑色命令窗口即可停止本地服务。
