# 项目与工作规范

这是一个面向日语学习的本地 Vue 3 + Vite 应用。每个请求必须先且只能分类为 `APP`、`STUDY` 或 `VOCAB` 中的一种模式，再执行对应规则。

## 最高原则

- 禁止擅自执行 `git push` 或以其他方式向远程仓库推送内容。
- 只有用户在当前请求中明确要求推送时，才可执行 push；提交代码、完成修改、运行构建或用户要求“发布”均不视为 push 授权。

## 请求路由

- `APP`：网页、布局、样式、交互、组件、路由、构建、搜索、筛选、收藏、音频及项目配置等应用目标。
- `STUDY`：日文稿校对、中文翻译、词汇与语法讲解、学习档案生成，以及围绕文章内容的后续问答。
- `VOCAB`：从指定文章或稿件中筛选生词、整理搭配、生成和验证临时背词 Excel。

确定分类后，先按模式选择基础规则：

- `APP`：`instructions/APP.md`
- `STUDY`：`instructions/STUDY.md`
- `VOCAB`：`instructions/VOCAB.md`

`STUDY` 还必须执行二级路由：

- 普通学习请求只完整读取 `instructions/STUDY.md`，在当前主对话中一次性处理，不主动启用长稿编排。
- 只有用户明确表示文章太长并要求分段处理时，长稿主代理才完整读取 `instructions/STUDY.md` 和 `instructions/STUDY_LONG.md`。文章仅仅看起来很长，不得自动触发长稿流程。
- 长稿部分子代理只读取 `instructions/STUDY.md`、`LEARNING_PROFILE.md`、`src/content/AGENTS.md` 和 `src/types.ts`；禁止读取 `instructions/STUDY_LONG.md`、全文、其他部分原文或其他部分产物。

除上述长稿主代理同时读取两份 `STUDY` 规则的明确例外外，不得读取或执行其他模式或路由分支的规则文件。完成分类并读取对应规则文件前，不得开始执行任务。

无法直接分类时，以用户正在讨论的对象为准：文章内容本身属于 `STUDY`，呈现方式、应用行为或项目配置属于 `APP`，临时背词表属于 `VOCAB`。当前浏览页面不能单独决定请求类型。
