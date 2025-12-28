# 部署说明

## 环境架构

| 环境 | 平台 | 域名 | 分支 |
|------|------|------|------|
| 生产环境 | GitHub Pages | https://wallpaper.061129.xyz/ | main |
| 测试环境 | Netlify | 自动生成 / test-wallpaper.061129.xyz | dev / PR |

## 测试环境配置 (Netlify)

### 1. 连接 Netlify

1. 访问 [Netlify](https://app.netlify.com/)
2. 点击 "Add new site" → "Import an existing project"
3. 选择 GitHub，授权并选择 `wallpaper-gallery` 仓库
4. 构建设置会自动从 `netlify.toml` 读取，无需手动配置
5. 点击 "Deploy site"

### 2. 配置自定义域名（可选）

如果想使用 `test-wallpaper.061129.xyz`：

1. 在 Netlify 控制台 → Site settings → Domain management
2. 点击 "Add custom domain"
3. 输入 `test-wallpaper.061129.xyz`
4. 在你的 DNS 服务商添加 CNAME 记录：
   ```
   test-wallpaper  CNAME  <your-site-name>.netlify.app
   ```

### 3. 功能特性

- **Deploy Previews**: 每个 PR 自动生成独立预览链接
- **Branch Deploys**: dev 分支自动部署到测试环境
- **环境标识**: 测试环境页面顶部显示"测试环境"标识

## 工作流程

```
开发流程:
1. 创建功能分支 → feature/xxx
2. 提交 PR → 自动生成预览链接
3. 测试通过 → 合并到 dev 分支
4. dev 分支 → 自动部署到 Netlify 测试环境
5. 测试环境验证 → 合并到 main 分支
6. main 分支 → 自动部署到 GitHub Pages 生产环境
```

## 环境变量

| 变量 | 开发 | 测试 | 生产 |
|------|------|------|------|
| VITE_ENV | development | staging | production |
| VITE_SHOW_ENV_BADGE | true | true | false |

## 本地测试

```bash
# 模拟测试环境构建
pnpm build --mode staging

# 模拟生产环境构建
pnpm build --mode production

# 预览构建结果
pnpm preview
```
