var sidebar = require("./sidebar");

module.exports = {
  title: '知识文档',
  description: '知识文档',
  themeConfig: {
    logo: '/img/logo.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'GitHub', link: 'https://github.com/wangjunjie1996/knowledge' },
    ],
    sidebar: [
      '/',
      sidebar.go(),
      sidebar.java(),
      sidebar.php(),
      sidebar.javascript(),
      // 小程序
      sidebar.miniprogram(),
      sidebar.vue(),
      sidebar.css(),
      // 数据库
      sidebar.database(),
      // 树莓派
      sidebar.raspberryPi(),
      // 其他
      sidebar.other(),
    ],
  }
}
