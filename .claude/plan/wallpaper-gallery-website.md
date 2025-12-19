# 壁纸画廊网站开发计划

## 项目概述

创建一个高雅大气的壁纸展示网站，从 GitHub 图床获取壁纸数据，支持搜索、排序、下载、主题切换等功能。

## 技术栈

- **框架**: Vue 3.5+ (Composition API + script setup)
- **构建工具**: Vite 7
- **语言**: JavaScript (不使用 TypeScript)
- **部署**: GitHub Pages + GitHub Actions

## 项目位置

`/Users/nuanxinpro/frontProject/gihtub/wallpaper-gallery`

## 数据源

```
https://raw.githubusercontent.com/IT-NuanxinPro/nuanXinProPic/main/wallpaper/{filename}
```

当前壁纸数量：63 张（51 jpg + 12 png）

---

## 详细执行步骤

### 阶段 1：项目初始化

#### 1.1 创建 Vite + Vue 项目
```bash
cd /Users/nuanxinpro/frontProject/gihtub
npm create vite@latest wallpaper-gallery -- --template vue
cd wallpaper-gallery
npm install
```

#### 1.2 安装依赖
```bash
# 无额外依赖，使用原生 CSS 变量实现主题
```

#### 1.3 配置 vite.config.js
- 设置 `base` 为 GitHub Pages 路径
- 配置别名 `@` 指向 `src`

---

### 阶段 2：项目结构搭建

#### 2.1 目录结构
```
wallpaper-gallery/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── scripts/
│   └── generate-data.js        # Node 脚本，构建时生成数据
├── public/
│   └── data/
│       └── wallpapers.json     # 构建时生成
├── src/
│   ├── assets/
│   │   └── styles/
│   │       ├── variables.css   # CSS 变量（主题色）
│   │       ├── animations.css  # 动画定义
│   │       └── main.css        # 全局样式
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppHeader.vue   # 顶部导航
│   │   │   └── AppFooter.vue   # 底部信息
│   │   ├── wallpaper/
│   │   │   ├── WallpaperCard.vue    # 壁纸卡片
│   │   │   ├── WallpaperGrid.vue    # 网格布局
│   │   │   └── WallpaperModal.vue   # 预览弹窗
│   │   ├── common/
│   │   │   ├── SearchBar.vue        # 搜索栏
│   │   │   ├── FilterPanel.vue      # 筛选面板
│   │   │   ├── ThemeToggle.vue      # 主题切换
│   │   │   └── LoadingSpinner.vue   # 加载动画
│   │   └── icons/
│   │       └── SvgIcon.vue          # SVG 图标组件
│   ├── composables/
│   │   ├── useWallpapers.js    # 壁纸数据管理
│   │   ├── useTheme.js         # 主题切换逻辑
│   │   ├── useFilter.js        # 搜索/排序逻辑
│   │   └── useModal.js         # 弹窗控制
│   ├── utils/
│   │   ├── format.js           # 格式化工具
│   │   └── constants.js        # 常量定义
│   ├── App.vue
│   └── main.js
├── index.html
├── vite.config.js
└── package.json
```

---

### 阶段 3：核心功能实现

#### 3.1 主题系统 (useTheme.js)
```js
// 功能：
// - 深色/浅色主题切换
// - localStorage 持久化
// - CSS 变量动态切换
// - 系统主题偏好检测
```

**CSS 变量定义 (variables.css)**:
```css
:root {
  /* 浅色主题 */
  --bg-primary: #f5f5f7;
  --bg-card: #ffffff;
  --text-primary: #1d1d1f;
  --shadow-card: 0 4px 20px rgba(0,0,0,0.08);
  /* ... */
}

[data-theme="dark"] {
  /* 深色主题 */
  --bg-primary: #1a1a1a;
  --bg-card: #2d2d2d;
  --text-primary: #f5f5f7;
  --shadow-card: 0 4px 20px rgba(0,0,0,0.4);
  /* ... */
}
```

#### 3.2 壁纸数据管理 (useWallpapers.js)
```js
// 功能：
// - fetch 加载 wallpapers.json
// - 响应式数据管理
// - 加载状态控制
```

#### 3.3 搜索排序 (useFilter.js)
```js
// 功能：
// - 文件名模糊搜索（防抖）
// - 排序：时间(新→旧)、大小(大→小)、名称(A→Z)
// - computed 实现响应式过滤
```

#### 3.4 壁纸卡片组件 (WallpaperCard.vue)
```vue
<!-- 功能：
  - 懒加载图片
  - 阴影效果
  - 标签显示（格式、分辨率等级）
  - hover 放大动画
  - 点击打开预览
-->
```

#### 3.5 预览弹窗 (WallpaperModal.vue)
```vue
<!-- 功能：
  - 大图预览
  - 详细信息展示
  - 下载按钮
  - 键盘导航(ESC关闭, 左右切换)
  - 淡入淡出动画
-->
```

---

### 阶段 4：动画效果

#### 4.1 animations.css
```css
/* 定义动画：
  - fadeIn/fadeOut
  - slideUp
  - scaleIn
  - shimmer (骨架屏)
*/
```

#### 4.2 Vue Transition
- 列表入场动画（stagger 错开效果）
- 弹窗过渡动画
- 主题切换过渡

#### 4.3 交互动画
- 卡片 hover 上浮 + 阴影增强
- 按钮 hover 缩放
- 搜索框 focus 展开

---

### 阶段 5：构建脚本

#### 5.1 generate-data.js
```js
// Node.js 脚本，在构建前执行
// 功能：
// 1. 读取图床仓库 wallpaper 目录文件列表（通过 GitHub API 或本地）
// 2. 生成 wallpapers.json，包含：
//    - id: 唯一标识
//    - filename: 文件名
//    - url: 完整 CDN 链接
//    - thumbnail: 缩略图链接（同源）
//    - size: 文件大小
//    - format: 文件格式
//    - tags: 自动标签 ['4K', 'PNG'] 等
//    - createdAt: 时间戳
```

---

### 阶段 6：GitHub Actions 部署

#### 6.1 deploy.yml
```yaml
# 触发条件：
# - push 到 main 分支
# - 手动触发

# 步骤：
# 1. Checkout
# 2. 安装 Node.js
# 3. 安装依赖
# 4. 运行 generate-data.js
# 5. 构建项目
# 6. 部署到 GitHub Pages
```

#### 6.2 需要用户配置
- 在 GitHub 仓库 Settings → Pages → Source 选择 `GitHub Actions`
- 无需额外 Token（使用默认 GITHUB_TOKEN）

---

## 响应式设计

| 断点 | 布局 |
|------|------|
| ≥1200px | 5 列网格 |
| ≥992px | 4 列网格 |
| ≥768px | 3 列网格 |
| ≥576px | 2 列网格 |
| <576px | 1 列网格 |

---

## 预期成果

1. **首页**: 壁纸网格展示 + 搜索栏 + 筛选面板 + 主题切换
2. **卡片**: 缩略图 + 标签 + 阴影 + hover 动效
3. **弹窗**: 大图预览 + 详情 + 下载
4. **主题**: 深色/浅色无缝切换
5. **部署**: 自动构建部署到 GitHub Pages

---

## 验收标准

- [ ] 所有壁纸正确加载显示
- [ ] 搜索功能正常（支持中英文）
- [ ] 排序功能正常（时间/大小/名称）
- [ ] 主题切换平滑，持久化有效
- [ ] 移动端响应式布局正常
- [ ] 动画流畅无卡顿
- [ ] 下载功能正常
- [ ] GitHub Actions 自动部署成功
