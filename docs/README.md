# Hello VuePress

[VuePress 官网](https://www.vuepress.cn/guide/)

::: tip
各种技术知识总结文档
:::

1. clone 后需要做以下操作启动 VuePress
* 将 VuePress 安装为本地依赖
  ```
  yarn add -D vuepress
  ```
* 在本地启动服务器
  ```
  yarn docs:dev
  ```
## 目录结构
* uePress 遵循 “约定优于配置” 的原则，推荐的目录结构如下：
```
.
├── docs
│   ├── .vuepress (可选的)
│   │   ├── components (可选的)
│   │   ├── theme (可选的)
│   │   │   └── Layout.vue
│   │   ├── public (可选的)
│   │   ├── styles (可选的)
│   │   │   ├── index.styl
│   │   │   └── palette.styl
│   │   ├── templates (可选的, 谨慎配置)
│   │   │   ├── dev.html
│   │   │   └── ssr.html
│   │   ├── config.js (可选的)
│   │   └── enhanceApp.js (可选的)
│   │ 
│   ├── README.md
│   ├── guide
│   │   └── README.md
│   └── config.md
│ 
└── package.json
```

* docs/.vuepress: 用于存放全局的配置、组件、静态资源等。
* docs/.vuepress/components: 该目录中的 Vue 组件将会被自动注册为全局组件。
* docs/.vuepress/theme: 用于存放本地主题。
* docs/.vuepress/styles: 用于存放样式相关的文件。
* docs/.vuepress/styles/index.styl: 将会被自动应用的全局样式文件，会生成在最终的 CSS 文件结尾，具有比默认样式更高的优先级。
* docs/.vuepress/styles/palette.styl: 用于重写默认颜色常量，或者设置新的 stylus 颜色常量。
* docs/.vuepress/public: 静态资源目录。
* docs/.vuepress/templates: 存储 HTML 模板文件。
* docs/.vuepress/templates/dev.html: 用于开发环境的 HTML 模板文件。
* docs/.vuepress/templates/ssr.html: 构建时基于 Vue SSR 的 HTML 模板文件。
* docs/.vuepress/config.js: 配置文件的入口文件，也可以是 YML 或 toml。
* docs/.vuepress/enhanceApp.js: 客户端应用的增强