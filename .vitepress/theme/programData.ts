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
        icon: 'https://besticon-demo.herokuapp.com/icon?url=https://zlibrary-china.se/&size=80..120..200',
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
        icon: 'https://news.ycombinator.com/favicon.ico',
        title: '黑客新闻',
        desc: 'Hacker News 是美国最大的程序员社区',
        link: 'https://news.ycombinator.com/',
      },
      {
        icon: 'https://besticon-demo.herokuapp.com/icon?url=https://www.producthunt.com/&size=80..120..200',
        title: 'Product Hunt',
        desc: '供用户分享和发现产品的平台',
        link: 'https://solo.xin/'
      },
      {
        icon: 'https://besticon-demo.herokuapp.com/icon?url=https://www.indiehackers.com/&size=80..120..200',
        title: 'Indie hackers',
        desc: '专门为独立开发者设立的论坛',
        link: 'https://www.indiehackers.com/'
      },
      {
        icon:'https://besticon-demo.herokuapp.com/icon?url=https://www.reddit.com/&size=80..120..200',
        title: 'Reddit',
        desc: 'Reddit是一个娱乐、社交及新闻网站',
        link: 'https://www.reddit.com/'
      },
      {
        icon:'https://besticon-demo.herokuapp.com/icon?url=https://stackoverflow.com&size=80..120..200',
        title: 'StackOverFlow',
        desc: '专为程序员提供的国际性问题解答交流社区',
        link: 'https://stackoverflow.com'
      },
      {
        icon: 'https://www.nodeseek.com/static/image/favicon/android-chrome-192x192.png',
        title: 'nodeseek',
        desc: 'nodeseek: Daily updates and insights on technology, software, and innovation.',
        link: 'https://www.nodeseek.com',
      }
    ]
  },
  {
    title: '后端资源',
    items: [
      {
        icon: 'https://besticon-demo.herokuapp.com/icon?url=https://docs.oracle.com&size=80..120..200',
        title: 'Java 官方文档',
        desc: '了解Java的标准API、新特性等',
        link: 'https://docs.oracle.com/javase/8/',
      },
      {
        icon: 'https://besticon-demo.herokuapp.com/icon?url=https://tech.meituan.com/2019/09/05/java-bytecode-enhancement.html&size=80..120..200',
        title: '美团技术团队',
        desc: '美团发布总结的一些技术文章',
        link: 'https://tech.meituan.com/',
      },
      {
        icon: 'https://dev.java/assets/images/java-logo-vector.png',
        title: 'The Destination for Java Developers',
        desc: '来自专家的数百个教程、新闻和视频，都在这里。',
        link: 'https://dev.java/',
      },
      {
        icon: 'https://besticon-demo.herokuapp.com/icon?url=https://go.dev/&size=80..120..200',
        title: 'Go语言官网',
        desc: '学习、了解Go语言途径',
        link: 'https://go.dev/',
      },
      {
        icon:'',
        title: 'Medium',
        desc: '一个轻量级内容发行的平台，允许单一用户或多人协作，将自己创作的内容以主题的形式结集为专辑（Collection）',
        link:'https://medium.com/tag/programming'
      },
      {
        icon:'',
        title:'Protobuf 终极教程',
        desc: 'Protocol Buffer (简称Protobuf) 是Google出品的性能优异、跨语言、跨平台的序列化库。',
        link: 'https://colobu.com/2019/10/03/protobuf-ultimate-tutorial-in-go/'
      }
    ]
  },
  {
    title: '前端资源',
    items: [
      {
        icon: 'https://besticon-demo.herokuapp.com/icon?url=https://zh.javascript.info/&size=80..120..200',
        title: '现代 JavaScript 教程',
        desc: '通过简单但足够详细的内容，为你讲解从基础到高阶的 JavaScript 相关知识。',
        link: 'https://zh.javascript.info/'
      },
      {
        icon: '',
        title: '表情符号备忘单',
        desc: 'markdown及github支持的表情',
        link: 'https://www.webfx.com/tools/emoji-cheat-sheet/'
      },{
        icon: '',
        title: 'Animated Favicon Generator',
        desc: '动态图标生成器, 动态Favicon, GIF转Favicon, 网站图标, 品牌形象, 吸引用户, 动态效果, 自定义图标, 网站设计, 动画图标',
        link: 'https://www.producthunt.com/posts/animated-favicon-generator?utm_campaign=producthunt-api&utm_medium=api-v2&utm_source=Application%3A+decohack+%28ID%3A+131684%29'
      }
    ]
  },
  {
    title: '人工智能资源',
    items: [
      {      
        icon: '',
        title: '动手实战人工智能 AI By Doing',
        desc: '一本中文电子书，通过实例介绍一些AI算法',
        link: 'https://aibydoing.com/intro'
    },{
      icon:'https://tools.webcrumbs.org/static/media/frontend_ai.8fa63940a5bc5d041f25fd1be390f1c1.svg',
      title:'Frontend AI',
      desc:'只需写下你想要的内容或粘贴图片，预览你的组件并获取代码。试试看吧——无需登录！',
      link:'https://www.webcrumbs.org/frontend-ai'
    }
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
      {
        icon: 'https://besticon-demo.herokuapp.com/icon?url=https://opensource.guide/&size=80..120..200',
        title: '开源指南',
        desc: '供想要学习如何运行开源项目并为开源项目做出贡献的个人、社区和公司使用',
        link: 'https://opensource.guide/',
      },
      {
        icon: 'https://besticon-demo.herokuapp.com/icon?url=https://opensource.guide/&size=80..120..200',
        title: '1000userguide',
        desc: '整理了300多个免费推广渠道，包括网站、论坛、网址导航、产品目录等，帮助独立开发者推广产品。',
        link: 'https://1000userguide.com/',
      },
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