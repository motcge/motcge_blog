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
      {text: 'Android', link: '/Android/test' },
      {text: 'SpringBoot', link: '/SpringBoot/test'},
    ],
    sidebar: {
      '/views/':[
        '',
        {
          title:'Android',
          collapsable:true,
          children:[
            'Android/test'
          ]
        },
        {
          title:'SpringBoot',
          collapsable:true,
          children:[
            'SpringBoot/test'
          ]
        }
      ]
    }, // 侧边栏配置
    sidebarDepth: 2, // 侧边栏显示2级
  }
};