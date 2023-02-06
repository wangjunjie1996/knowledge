module.exports = {
    go: function() {
        return {
          title: 'GO 知识',
          children: [
            {
              title: 'GO 基础',
              children: [
                '/go/go/1README',
                '/go/go/2GO语言容器',
                '/go/go/3Go语言流程控制',
                '/go/go/4Go语言函数',
                '/go/go/5Go语言结构体',
                '/go/go/6Go语言接口',
                '/go/go/7Go语言包',
                '/go/go/8Go语言 go mod包依赖管理工具',
                '/go/go/9Go语言生成二维码及Context',
                '/go/go/10Go语言发送电子邮件',
                '/go/go/11Go语言并发',
                '/go/go/12Go语言反射',
                '/go/go/13Go语言网络编程'
              ],
            },
            {
              title: 'GO Bin 框架',
              children: [
                '/go/gobin/',
              ],
            },
          ],
        };
    },
    java: function() {
      return {
        title: 'JAVA',
        children: [
          {
            title: 'JAVA',
            children: [
              '/java/java/'
            ],
          },
          {
            title: 'JAVAWeb(ssm)',
            children: [
              '/java/javaweb(ssm)/'
            ],
          },
          {
            title: 'Spring Boot',
            children: [
              '/java/springboot/',
              '/java/springboot/springboot异步'
            ],
          }
        ],
      };
    },
    php: function() {
      return {
        title: 'PHP',
        children: [
          {
            title: 'PHP',
            children: [
              '/php/php/'
            ],
          },
          {
            title: 'ThinkPhp',
            children: [
              '/php/thinkphp/'
            ],
          },
          {
            title: 'yii2',
            children: [
              '/php/yii2/'
            ],
          },
        ],
      };
    },
    javascript: function() {
      return {
        title: 'javascript',
        children: [
          '/javascript/',
          '/javascript/Javascript面向对象'
        ],
      };
    },
    miniprogram: function() {
      return {
        title: '小程序',
        children: [
          '/miniprogram/'
        ],
      };
    },
    vue: function() {
      return {
        title: 'vue',
        children: [
          '/vue/'
        ],
      };
    },
    css: function() {
      return {
        title: 'css',
        children: [
          '/css/'
        ],
      };
    },
    database: function() {
      return {
        title: '数据库',
        children: [
          {
            title: 'oracle',
            children: [
              '/database/oracle/'
            ],
          },
          {
            title: 'mysql',
            children: [
              '/database/mysql/'
            ],
          },
          {
            title: 'mongodb',
            children: [
              '/database/mongodb/'
            ],
          },
          {
            title: 'postgreSQL',
            children: [
              '/database/postgreSQL/'
            ],
          }
        ],
      };
    },
    raspberryPi: function() {
      return {
        title: '树莓派',
        children: [
          '/raspberryPi/'
        ],
      };
    },
    other: function() {
      return {
        title: '其他',
        children: [
          {
            title: 'ChatGPT',
            children: [
              '/other/ChatGPT',
              '/other/php+yii2+mongodb环境安装'
            ],
          }
        ],
      };
    }
}