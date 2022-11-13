module.exports = {
  title: '知识文档',
  description: '知识文档',
  themeConfig: {
    logo: '/img/logo.png',
    nav: [
      { text: 'Home', link: '/' },
    ],
    sidebar: [
      '/',
      // java
      {
        title: 'JAVA',
        link: '/java/',
        children: [
          '/java/java/'
        ],
      },
      // go
      {
        title: 'GO 知识',
        link: '/go/',
        children: [
          '/go/go/',
          '/go/go/GO语言容器',
          '/go/go/Go语言流程控制'
        ],
      }
    ],
  }
}