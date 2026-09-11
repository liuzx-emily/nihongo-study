# 日语学习档案

一个面向电脑端的本地日语学习应用，用于保存和阅读经过校对的日文稿、中文翻译、重点词汇、语法及句子解析。项目基于 Vue 3、TypeScript 和 Vite。

## 主要功能

- 按文章集中管理日语学习档案
- 日文原稿与中文翻译逐段对照阅读
- 展示重点词汇、语法、口语结构和句子解析
- 提供文章目录、阅读位置提示和返回顶部操作
- 按段标记学习进度，并汇总为“未学 / 学习中 / 已学”
- 自动推荐尚未完成的文章，并定位到首个未学段落
- 从档案页面跳转到原始内容来源

## 技术栈

- Vue 3
- Vue Router
- TypeScript
- Vite
- 原生 CSS

## 运行环境

- Node.js 20.19+ 或 22.12+
- npm
- 宽度不小于 1180px 的电脑屏幕

本项目仅提供电脑端布局。屏幕较窄时页面可以横向滚动，不包含手机、平板或触控设备适配。

## 本地运行

```bash
npm install
npm run dev
```

开发服务器启动后，按照终端显示的本地地址访问应用。

## 常用命令

```bash
# 启动开发服务器
npm run dev

# 执行 TypeScript 检查并构建生产文件
npm run build

# 本地预览生产构建
npm run preview
```

构建结果输出到 `dist/`。

## 部署

项目通过 `.github/workflows/deploy-pages.yml` 自动部署到 GitHub Pages。

- 推送到 `master` 分支时自动触发，也可在 GitHub Actions 中手动运行。
- workflow 使用 Node.js 22，通过 `npm ci` 安装依赖并执行 `npm run build`。
- 构建成功后，将 `dist/` 作为 GitHub Pages artifact 发布。
- GitHub Pages 上的学习进度是部署时从 `study-progress.json` 生成的只读快照，网页端不会把进度写回仓库。需要更新线上进度时，应先在本地开发模式中保存并提交该文件，再重新部署。

## 项目结构

```text
.
├─ .github/workflows/       GitHub Pages 自动部署
├─ public/                 静态资源
├─ src/
│  ├─ components/         可复用 Vue 组件
│  ├─ content/            日语学习档案及文章索引
│  ├─ views/              首页与文章页
│  ├─ router.ts           Hash 路由配置
│  ├─ studyProgress.ts    学习进度状态与读写逻辑
│  ├─ styles.css          全局样式
│  └─ types.ts            档案数据类型
├─ study-progress.json    本地学习进度
├─ vite.config.ts         Vite 配置与进度 API
└─ AGENTS.md              项目工作规范
```

## 学习档案

每篇文章是一个满足 `StudyArticle` 类型的独立 TypeScript 文件，保存在 `src/content/`。文章包含基本元数据和若干学习段落；每个段落包含：

- 修正后的日文稿
- 完整中文翻译
- 重点词汇与语境说明
- 语法、接续及例句
- 重点句子的结构、口语特点和可迁移表达

创建档案时：

1. 使用 `YYYY-MM-DD-英文简短名称.ts` 作为文件名。
2. 使用相同格式且全局唯一的 `slug`。
3. 按 `src/types.ts` 填写完整数据。
4. 在 `src/content/index.ts` 中导入并登记文章。
5. 运行 `npm run build` 验证类型和构建结果。

详细内容标准参见 `src/content/AGENTS.md`。

## 学习进度

开发模式下，Vite 提供本地进度 API。页面上的分段或整篇学习状态会写入根目录的 `study-progress.json`。

生产构建会把该文件作为只读资源复制到 `dist/study-progress.json`，因此生产预览可以显示构建时的进度，但不会在页面中修改源文件。进度数据以文章 `slug` 和 section `id` 关联；调整这些标识前应同步考虑已有进度。

## 路由

项目使用 Hash 路由，可直接以静态文件形式部署：

- `#/`：学习档案列表
- `#/article/:slug`：文章学习页面

## 开发约定

项目规范按目录生效：

- `AGENTS.md`：请求分类、电脑端限制、应用与学习工作流
- `src/AGENTS.md`：前端代码组织和实现质量
- `src/content/AGENTS.md`：学习档案内容与数据规则

修改应用代码或档案数据后，必须运行 `npm run build`。
