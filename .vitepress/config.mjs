import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // 部署配置
  ignoreDeadLinks: true,
  base: '/',
  // 站点配置
  title: "My Awesome Project",
  description: "A VitePress Site",
  themeConfig: {
    logo: "https://binarycoder777-site.oss-cn-chengdu.aliyuncs.com/21707272915_.pic.jpg",
    siteTitle: 'BinaryCoder777',
    search: {
      provider: 'local'
    },
    nav: [
      { text: '主页', link: '/' },
      { text: '编程导航', link: '/docs/program' },
      { text: '日常随笔', link: '/docs/article/' },
      { text: '个人书库', link: '/docs/book/' },
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
                  text: 'Apache Lucene简介',
                  link: ''
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
              text: 'Go语言圣经',
              collapsed: true,
              items: [
                {
                  text: '程序结构',
                  link: '/docs/book/Go语言系列/Go语言圣经/程序结构.md'
                }
              ]
            },
          ],
        }
      ],
      '/docs/project/': [
        {
          text: '个人站点搭建',
          items: [
            { text: '基于PicGo搭建一个图床', link: '/docs/project/个人站点搭建/基于PicGo搭建一个图床.md' },
            { text: '基于Vitepress搭建个人文档站点', link: '/docs/project/个人站点搭建/基于Vitepress搭建个人文档站点.md' }
          ]
        },

      ]
    }
  },
})

