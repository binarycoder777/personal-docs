import { text } from 'stream/consumers'
import { defineConfig } from 'vitepress'
import sidebar_article from '../generateSidebarArticle.js'; // 导入自动生成的侧边栏
import sidebar_book from '../generateSidebarBook.js'; // 导入自动生成的侧边栏


// RSS 订阅
// vitepress/config.js
import { RssPlugin } from 'vitepress-plugin-rss'

// 配置 RSS 插件选项
const baseUrl = 'https://binarycoder777.cn'
const RSS = {
  title: 'BinaryCoder777',
  baseUrl,
  copyright: 'Copyright (c) 2019-present, BinaryCoder777',
  description: 'BinaryCoder777的个人博客',
  language: 'zh-cn',
  author: {
    name: 'binarycoder777',
    email: 'atao67276@gmail.com',
    link: 'https://binarycoder777.cn'
  },
  icon: true,
  authors: [
    {
      name: 'BinaryCoder777',
      email: 'atao67276@gmail.com',
      link: 'https://binarycoder777.cn'
    },
    {
      name: 'BinaryCoder777',
      email: '',
      link: 'https://binarycoder777.cn'
    }
  ],
  filename: 'feed.rss',
  log: true,
  ignoreHome: true,
  ignorePublish: false,
}



// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: {
    plugins: [
      RssPlugin(RSS)
    ]
  },
  // 部署配置
  ignoreDeadLinks: true,
  base: '/',
  // 站点配置
  title: "BinaryCoder777",
  description: "个人站点",
  head:[
    ['link', { rel: 'icon', href: 'https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/favicon.ico' }]  // 使用根路径引用
  ],
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
      // { text: '编程导航', link: '/docs/program' },
      { text: '随思随笔', link: '/docs/article/' },
      { text: '技术秘籍', link: '/docs/book/' },
      { text: '关于我', link: '/docs/about' },
      {
        text: '其他', items: [
          {
            text: "z-library",
            link:"https://zh.z-lib.gs/book/"
          },
          {
            text: "ChatGPT",
            link: "https://chat.openai.com/"
          },
          // {
          //   text: "个人周刊",
          //   link: "https://binarycoder777.com"
          // },
          // {
          //   text:"个人工具",
          //   link:"https://personal-k7of91wlx-binarycoder777s-projects.vercel.app/"
          // },
          // {
          //   text: "LobChat",
          //   link: "https://lobe-chat-eight-virid-32.vercel.app/chat"
          // },
          {
            text: "iFixit",
            link: "https://zh.ifixit.com/"
          }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/binarycoder777' },
      { icon: 'twitter', link: 'https://x.com/binarycoder777' },
      { icon: 'discord', link: 'https://discord.gg/7k3fsuas' },
      // { icon: 'vercel', link: 'https://vercel.com/binarycoder777s-projects' }
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
      '/docs/article/': sidebar_article,
      '/docs/book/': sidebar_book,
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
    },
    markdown: {
      image: {
        // 默认禁用；设置为 true 可为所有图片启用懒加载。
        lazyLoading: true
      }
    },
    sitemap: {
        hostname: 'https://binarycoder777.cn'
      }
  },
})

