# Clarity.ai

<div align="center">
  <img src="public/favicon.svg" alt="Clarity.ai Logo" width="120" height="120">
  
  <p align="center">
    <strong>一个现代化的智能AI对话平台，支持多种AI模型和虚拟人角色交互</strong>
  </p>
  <p align="center">
    <strong>体验链接：https://trae5qohp5sv.vercel.app</strong>
  </p>
  <p align="center">
    <strong>文档链接：https://xiaopeng.feishu.cn/docx/Yrahd7vdnoXilYxXkJkc1rEEnAh</strong>
  </p>
  <p align="center">
    <a href="#功能特性">功能特性</a> •
    <a href="#技术栈">技术栈</a> •
    <a href="#快速开始">快速开始</a> •
    <a href="#项目结构">项目结构</a> •
    <a href="#环境配置">环境配置</a>
  </p>
</div>

## 🌟 功能特性

### 🤖 多AI模型支持
- **Gemini AI** - Google最新的生成式AI模型
- **Claude** - Anthropic的智能对话助手
- **GPT系列** - OpenAI的强大语言模型
- **智能模型切换** - 根据对话需求自动选择最适合的AI模型

### 👥 虚拟人角色对话
- **丰富角色库** - 多种个性化虚拟人角色
- **角色定制** - 自定义角色背景和对话风格
- **情境对话** - 支持不同场景下的专业对话
- **角色记忆** - 保持对话上下文和角色一致性

### 📱 现代化用户界面
- **响应式设计** - 完美适配桌面端和移动端
- **暗色主题** - 护眼的深色模式界面
- **平滑动画** - 流畅的交互动画效果
- **直观操作** - 简洁易用的用户体验

### 📊 智能对话管理
- **历史记录** - 完整的对话历史保存和检索
- **对话分类** - 智能分类和标签管理
- **搜索功能** - 快速查找历史对话内容
- **导出功能** - 支持对话内容导出

### ⚙️ 个性化设置
- **用户配置** - 个人资料和偏好设置
- **AI参数调节** - 自定义AI响应参数
- **隐私控制** - 完善的隐私保护设置
- **主题定制** - 多种界面主题选择

## 🛠 技术栈

### 前端技术
- **React 18** - 现代化的前端框架
- **TypeScript** - 类型安全的JavaScript超集
- **Vite** - 快速的构建工具和开发服务器
- **Tailwind CSS** - 实用优先的CSS框架
- **Framer Motion** - 强大的动画库

### 后端技术
- **Node.js** - JavaScript运行时环境
- **Express** - 轻量级Web应用框架
- **TypeScript** - 后端类型安全支持
- **Koa** - 现代化的Web框架

### AI集成
- **Google Generative AI** - Gemini模型集成
- **OpenAI API** - GPT模型支持
- **Anthropic Claude** - Claude模型集成
- **多模型管理** - 统一的AI服务接口

### 开发工具
- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **Concurrently** - 并发运行开发服务
- **Nodemon** - 自动重启开发服务器

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- pnpm >= 8.0.0 (推荐) 或 npm >= 9.0.0

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/HowieCong/Clarity.ai.git
cd Clarity.ai
```

2. **安装依赖**
```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
```

3. **环境配置**
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑环境变量文件
nano .env
```

4. **启动开发服务器**
```bash
# 启动前端和后端开发服务器
pnpm run dev

# 或分别启动
pnpm run client:dev  # 前端开发服务器 (http://localhost:5173)
pnpm run server:dev  # 后端API服务器 (http://localhost:3000)
```

5. **访问应用**
打开浏览器访问 [http://localhost:5173](http://localhost:5173)

### 生产构建

```bash
# 构建生产版本
pnpm run build

# 预览生产构建
pnpm run preview
```

## 📁 项目结构

```
Clarity.ai/
├── api/                    # 后端API服务
│   ├── app.ts             # Express应用入口
│   ├── index.ts           # API路由索引
│   ├── routes/            # API路由定义
│   └── services/          # AI服务集成
├── src/                   # 前端源代码
│   ├── components/        # React组件
│   │   ├── ui/           # 基础UI组件
│   │   ├── Navigation.tsx # 导航组件
│   │   ├── VirtualPersonSection.tsx # 虚拟人对话组件
│   │   └── UserInputSection.tsx     # 用户输入组件
│   ├── pages/            # 页面组件
│   │   ├── ChatPage.tsx  # 对话页面
│   │   ├── HistoryPage.tsx # 历史记录页面
│   │   └── SettingsPage.tsx # 设置页面
│   ├── services/         # 前端服务
│   ├── store/           # 状态管理
│   ├── hooks/           # 自定义Hooks
│   └── lib/             # 工具函数
├── public/              # 静态资源
├── shared/              # 共享类型定义
└── .vercel/            # Vercel部署配置
```

## ⚙️ 环境配置

### 必需的环境变量

创建 `.env` 文件并配置以下变量：

```env
# AI模型API密钥
GOOGLE_API_KEY=your_google_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_claude_api_key

# 服务器配置
PORT=3000
NODE_ENV=development

# 前端配置
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=Clarity.ai
```

### API密钥获取

1. **Google Gemini API**
   - 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
   - 创建新的API密钥
   - 将密钥添加到 `GOOGLE_API_KEY`

2. **OpenAI API**
   - 访问 [OpenAI Platform](https://platform.openai.com/api-keys)
   - 创建新的API密钥
   - 将密钥添加到 `OPENAI_API_KEY`

3. **Anthropic Claude API**
   - 访问 [Anthropic Console](https://console.anthropic.com/)
   - 获取API密钥
   - 将密钥添加到 `ANTHROPIC_API_KEY`

## 🎯 使用指南

### 基本对话
1. 选择AI模型（Gemini、GPT、Claude）
2. 选择虚拟人角色（可选）
3. 输入对话内容
4. 查看AI响应

### 历史记录管理
- 访问 `/history` 页面查看所有对话历史
- 使用搜索功能快速查找特定对话
- 点击历史记录继续之前的对话

### 个性化设置
- 访问 `/settings` 页面进行个人配置
- 调整AI响应参数
- 设置隐私偏好
- 选择界面主题

## 🚀 部署

### Vercel部署 (推荐)

1. **连接GitHub仓库**
```bash
# 安装Vercel CLI
npm i -g vercel

# 登录并部署
vercel --prod
```

2. **配置环境变量**
在Vercel Dashboard中添加所需的环境变量

3. **自动部署**
推送到main分支将自动触发部署

### 其他部署选项
- **Netlify** - 支持静态站点部署
- **Railway** - 支持全栈应用部署
- **Docker** - 容器化部署

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 贡献方式
1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 开发规范
- 遵循 ESLint 配置
- 使用 TypeScript 进行类型检查
- 编写清晰的提交信息
- 添加适当的测试用例

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [React](https://reactjs.org/) - 前端框架
- [Vite](https://vitejs.dev/) - 构建工具
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [Google Generative AI](https://ai.google.dev/) - AI模型支持
- [OpenAI](https://openai.com/) - GPT模型支持
- [Anthropic](https://www.anthropic.com/) - Claude模型支持

## 📞 联系我们

- **项目主页**: [https://github.com/HowieCong/Clarity.ai](https://github.com/HowieCong/Clarity.ai)
- **问题反馈**: [Issues](https://github.com/HowieCong/Clarity.ai/issues)
- **功能建议**: [Discussions](https://github.com/HowieCong/Clarity.ai/discussions)

---

<div align="center">
  <p>⭐ 如果这个项目对你有帮助，请给我们一个星标！</p>
  <p>Made with ❤️ by <a href="https://github.com/HowieCong">HowieCong</a></p>
</div>
