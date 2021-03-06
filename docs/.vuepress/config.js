module.exports = {
  title: "motcge's blog",
  description: '个人博客',
  head: [ // 注入到当前页面的 HTML <head> 中的标签
    ['link', { rel: 'icon', href: '/logo.jpg' }], // 增加一个自定义的 favicon(网页标签的图标)
  ],
  base: '/', // 这是部署到github相关的配置
  port:8088,
  markdown: {
    lineNumbers: false // 代码块显示行号
  },
  themeConfig: {
    nav:[ // 导航栏配置
      {text: 'Android', link: '/Android/main' },
      {text: 'SpringBoot', link: '/SpringBoot/main'},
    ],
    sidebar: {
      '/views/':[
        '',
        {
          title:'Android',
          collapsable:true,
          children:[
            'Android/main',
            'Android/WebViewProblem'
          ]
        },
        {
          title:'SpringBoot',
          collapsable:true,
          children:[
            'SpringBoot/main',
            'SpringBoot/fileUpAndDownload',
            'SpringBoot/redisConfig',
            'SpringBoot/encryption',
            'SpringBoot/https'
          ]
        },
        {
          title:'Vue',
          collapsable:true,
          children:[
            'Vue/main',
            'Vue/tips'
          ]
        },
        {
          title:'API',
          collapsable:true,
          children:[
            'API/chinaMobileMasAPI'
          ]
        },
        {
          title:'uni-app',
          collapsable:true,
          children:[
            'uni-app/main',
            'uni-app/tips'
          ]
        },
        {
          title:'SoftWareConfig',
          collapsable:true,
          children:[
            'SoftWareConfig/main',
            'SoftWareConfig/IDEA',
            'SoftWareConfig/Maven'
          ]
        }
      ]
    }, // 侧边栏配置
    sidebarDepth: 2, // 侧边栏显示2级
    lastUpdated: 'Last Updated',
  }
};