# 图床服务搭建计划

我将为你搭建一个基于 **Vue 3 + Element Plus** (前端) 和 **Node.js + Express** (后端) 的全栈图床服务。

## 1. 技术栈选择
*   **前端**: Vue 3, Vite, Element Plus (UI组件库), Axios (网络请求)
*   **后端**: Node.js, Express, Multer (文件上传处理), Axios (后端下载URL图片)
*   **数据存储**: 本地文件系统存储图片，服务端扫描目录获取列表 (MVP版本，简单高效)

## 2. 功能模块设计
### 后端 (Server)
1.  **环境搭建**: 初始化 Express 项目，配置 CORS 跨域。
2.  **图片上传接口 (`/api/upload`)**:
    *   使用 `multer` 中间件支持 `multipart/form-data`。
    *   支持**批量上传**。
    *   自动生成唯一文件名以防冲突。
3.  **URL上传接口 (`/api/upload-url`)**:
    *   接收 URL 列表 (JSON数组)。
    *   后端遍历 URL 使用 `axios` 下载图片流并保存到本地。
    *   返回成功/失败结果及统计。
4.  **图片列表接口 (`/api/images`)**:
    *   扫描上传目录，返回所有图片的可访问 URL 列表。
    *   按修改时间倒序排列 (最新的在前)。
5.  **静态资源服务**: 托管上传文件夹，使图片可通过 URL 访问。

### 前端 (Client)
1.  **界面布局**:
    *   使用 Element Plus 的 `el-container` 布局。
    *   顶部导航栏或 Tabs 切换 "图库展示" 和 "上传中心"。
2.  **上传中心组件**:
    *   **本地上传**: 使用 `el-upload` 组件，开启 `drag` (拖拽) 和 `multiple` (多选) 模式。
    *   **URL上传**: 提供 `el-input type="textarea"` 输入框，支持一行一个 URL，批量提交。显示下载进度或结果列表。
3.  **图库展示组件**:
    *   使用 `el-image` 进行瀑布流或网格展示。
    *   支持图片预览 (`preview-src-list`)。
    *   支持复制图片链接。

## 3. 实施步骤
1.  **项目初始化**: 创建 `wherePhoto` 根目录，建立 `server` 和 `client` 子目录。
2.  **后端实现**:
    *   编写 `server/package.json` 并安装依赖。
    *   实现核心 API 服务 (`index.js`)。
    *   创建上传目录 `uploads`。
3.  **前端实现**:
    *   使用 Vite 创建 Vue 3 项目。
    *   集成 Element Plus。
    *   开发 Upload 和 Gallery 页面。
    *   配置 Axios 对接后端接口。
4.  **联调与验证**:
    *   启动前后端服务。
    *   测试批量上传文件。
    *   测试批量 URL 下载。
    *   验证图库加载是否正常。

准备好后，请确认此计划，我将开始编写代码。