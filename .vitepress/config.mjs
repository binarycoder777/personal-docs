import { text } from 'stream/consumers'
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  head: [
    // 添加 favicon.ico
    ['link', { rel: 'icon', href: '/favicon.ico', type: 'image/x-icon' }],
  ],
  // 部署配置
  ignoreDeadLinks: true,
  base: '/',
  // 站点配置
  title: "BinaryCoder777",
  description: "个人站点",
  themeConfig: {
    siteTitle: 'BinaryCoder777',
    // 搜索栏
    search: {
      provider: 'local'
    },
     // 编辑链接
     editLink: {
      pattern: "https://github.com/vuejs/vitepress/edit/main/docs/:path", // 自己项目仓库地址
      text: "在 github 上编辑此页",
    },
    // navbar栏
    nav: [
      { text: '主页', link: '/' },
      { text: '编程导航', link: '/docs/program' },
      { text: '随思随笔', link: '/docs/article/' },
      { text: '技术秘籍', link: '/docs/book/' },
      { text: '项目开发', link: '/docs/project/' },
      {
        text: '其他', items: [
          {
            text: "ChatGPT",
            link: "https://chat.openai.com/"
          },
          {
            text: "MyLobeChat",
            link: "https://lobe-chat-xi-dusky.vercel.app"
          }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/binarycoder777' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2019-present BinaryCoder777'
    },
    // 开启最后更新于
    lastUpdated: true,
    lastUpdatedText: "最后更新", // string
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    image: {
      // 默认禁用图片懒加载
      lazyLoading: true
    },
    // 侧边栏
    sidebar: {
      '/docs/article/': [
        {
          text: '2024',
          collapsed: true,
          items: [
            {
              text: '2月',
              collapsed: true,
              items: [
                {
                  text:'关于ResolvableTypeProvider',
                  link:'/docs/article/2024/2月/关于ResolvableTypeProvider.md'
                },
                {
                  text: '重新整理vim常用指令',
                  link: '/docs/article/2024/2月/重新整理vim常用指令.md'
                }
              ]
            }
          ]
        }
      ],
      '/docs/book/': [
        {
          text: 'ElasticSearch系列',
          collapsed: true,
          items: [
            {
              text: '深入理解ElasticSearch',
              collapsed: true,
              items: [
                {
                  text: '关于Elasticsearch',
                  link: '/docs/book/ElasticSearch系列/深入理解ElasticSearch/关于Elasticsearch.md'
                },
                {
                  text: 'Apache Lucene简介',
                  link: '/docs/book/ElasticSearch系列/深入理解ElasticSearch/Apache Lucene简介.md'
                },
              ]
            },
            {
              text: 'ElasticSearch源码解析与优化实战',
              collapsed: true,
              items: [
                {
                  text: '走进ElasticSearch',
                  link: ''
                }
              ]
            }
          ],
        },
        {
          text: 'Go语言系列',
          collapsed: true,
          items: [
            {
              text: '前言',
              link: '/docs/book/Go语言系列/index.md'
            },
            {
              text: 'Go语言圣经',
              collapsed: true,
              items: [
                {
                  text: '程序结构',
                  link: '/docs/book/Go语言系列/Go语言圣经/程序结构.md'
                },{
                  text: '数据类型',
                  link: '/docs/book/Go语言系列/Go语言圣经/数据类型.md'
                },{
                  text: '函数',
                  link: '/docs/book/Go语言系列/Go语言圣经/函数.md'
                },{
                  text: '方法',
                  link: '/docs/book/Go语言系列/Go语言圣经/方法.md'
                },{
                  text: '接口',
                  link: '/docs/book/Go语言系列/Go语言圣经/接口.md'
                },{
                  text: 'Goroutines和Channels',
                  link: '/docs/book/Go语言系列/Go语言圣经/Goroutines和Channels.md'
                },{
                  text: '基于共享变量的并发',
                  link: '/docs/book/Go语言系列/Go语言圣经/基于共享变量的并发.md'
                },{
                  text: '包和工具',
                  link: '/docs/book/Go语言系列/Go语言圣经/包和工具.md'
                },{
                  text: '测试',
                  link: '/docs/book/Go语言系列/Go语言圣经/测试.md'
                },{
                  text: '反射',
                  link: '/docs/book/Go语言系列/Go语言圣经/反射.md'
                },{
                  text: '底层编程',
                  link: '/docs/book/Go语言系列/Go语言圣经/底层编程.md'
                }
              ]
            },
            {
              text: 'Go语言实战',
              collapsed: true,
              items:[
                {
                  text:'打包和工具链',
                  link: '/docs/book/Go语言系列/Go语言实战/打包和工具链.md'
                },
                {
                  text: '数组、切片和映射',
                  link: '/docs/book/Go语言系列/Go语言实战/数组、切片和映射.md'
                },
                {
                  text:'类型系统',
                  link: '/docs/book/Go语言系列/Go语言实战/类型系统.md'
                }
                ,
                {
                  text: '并发',
                  link: 'docs/book/Go语言系列/Go语言实战/并发.md'
                },
                {
                  text: '并发实战',
                  link: 'docs/book/Go语言系列/Go语言实战/并发实战.md'
                }
              ]
            },
            {
              text: 'Go Web 编程',
              collapsed: true,
              items:[
                {
                  
                }
              ]
            },            
            {
              text: 'Go语言高级编程',
              collapsed: true,
              items:[
                {
                  
                }
              ]
            }
          ],
        }
      ],
      '/docs/project/': [
        {
          text: '个人站点搭建',
          collapsed: true,
          items: [
            { text: '基于PicGo搭建一个图床', link: '/docs/project/个人站点搭建/基于PicGo搭建一个图床.md' },
            { text: '基于Vitepress搭建个人文档站点', link: '/docs/project/个人站点搭建/基于Vitepress搭建个人文档站点.md' }
          ]
        },

      ]
    }
  },
})

