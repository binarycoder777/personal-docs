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
      { text: '日常随笔', link: '/docs/article/' },
      { text: '个人书库', link: '/docs/book/' },
      { text: '项目开发', link: '/docs/project/' },
      { text: '其他', link: '/markdown-examples' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2019-present BinaryCoder777'
    },

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
      ]
    },
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
                text: 'Apache Lucene简介',
                link: ''
              }
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
        ]
      },
    ],
    '/docs/project/': [
      {
        text: '基于Astro的个人站点搭建',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      },
    ]
  },

  socialLinks: [
    { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
  ]
})

