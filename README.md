# HR---AI
[README.md](https://github.com/user-attachments/files/28824982/README.md)
# 未来鹅 FutureGoose｜大学生职业成长 AI 陪伴体 Demo

这是一个可直接部署的静态网页 Demo，面向在校大学生提供职业诊断、岗位雷达、问答陪伴、模拟面试和 7 天成长计划。

## 文件说明
- `index.html`：页面结构
- `styles.css`：视觉样式
- `app.js`：前端交互和规则型 AI Demo

## 本地运行
直接双击 `index.html`，或使用 VS Code Live Server 打开。

## 公网部署
### Vercel
1. 新建 GitHub 仓库并上传本文件夹全部文件。
2. 登录 Vercel → Add New Project → 选择仓库。
3. Framework 选择 Other，Build Command 留空，Output Directory 留空。
4. 点击 Deploy，获得公网链接。

### GitHub Pages
1. 仓库 Settings → Pages。
2. Source 选择 `Deploy from a branch`，Branch 选择 `main / root`。
3. 保存后等待生成链接。

## 接入真实 AI
当前版本为「无后端、无 Key」静态 Demo，适合盲评展示和交互验证。若接入 Dify / 腾讯元器：
1. 在智能体平台创建应用，上传知识库：校招 FAQ、岗位 JD、人才培养资料、简历模板、面试题库。
2. 配置系统提示词和年级分流工作流。
3. 发布 API。
4. 在 `app.js` 的 `callRealAI()` 中通过后端或 Serverless Function 调用 API。

> 注意：不要把 API Key 直接写在前端代码里。
