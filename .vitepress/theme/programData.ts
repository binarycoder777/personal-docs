import type { NavLink } from './components/type'

type NavData = {
  title: string
  items: NavLink[]
}

export const NAV_DATA: NavData[] = [
  {
    title: '图书站点',
    items: [
      {
        icon: 'https://raw.githubusercontent.com/binarycoder777/personal-pic/main/pic/Xnip2024-02-26_10-10-49.jpg',
        title: 'zlibrary',
        desc: '全球最大数字图书馆',
        link: 'https://zlibrary-china.se/',
      }
    ],
  },
  {
    title: '社区论坛',
    items: [
      {
        icon: '',
        title: '黑客新闻',
        desc: 'Hacker News 是美国最大的程序员社区',
        link: 'https://news.ycombinator.com/',
      },
    ]
  },
  {
    title:'开拓视野',
    items: [
      {
        icon: '',
        title: '科技爱好者周刊',
        desc: '记录每周值得分享的科技内容，周五发布',
        link: 'https://github.com/ruanyf/weekly?tab=readme-ov-file',
      },
    ]
  },
  {
    title: '独立开发者',
    items: [
      {
        icon: '',
        title: 'Solo 独立开发者社区',
        desc: '针对独立开发者的交流、合作、分享的平台',
        link: 'https://solo.xin/'
      }
    ]
  },
  {
    title: '常用工具',
    items: [
      {
        icon: 'https://tinypng.com/images/apple-touch-icon.png',
        title: 'TinyPNG',
        desc: '在线图片压缩工具',
        link: 'https://tinypng.com',
      },
      {
        icon: 'https://devtool.tech/logo.svg',
        title: '开发者武器库',
        desc: '开发者武器库，做开发者最专业最好用的专业工具箱',
        link: 'https://devtool.tech',
      },
      {
        icon: 'https://tool.lu/favicon.ico',
        title: '在线工具',
        desc: '开发人员的工具箱',
        link: 'https://tool.lu',
      },
      {
        icon: '/icons/json-cn.ico',
        title: 'Json 中文网',
        desc: 'JSON 在线解析及格式化验证',
        link: 'https://www.json.cn',
      },
    ],
  },
]