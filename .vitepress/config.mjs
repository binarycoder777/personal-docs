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
            },
            {
              text: '3月',
              collapsed:true,
              items: [
                {
                  text:'Java命令行打包总结',
                  link:'/docs/article/2024/3月/Java命令行打包总结.md'
                },
                {
                  text:'Instrument-字节码插桩',
                  link: '/docs/article/2024/3月/Instrument-字节码插桩.md'
                },
                {
                  text: 'JNI-在Java中调用C代码',
                  link: '/docs/article/2024/3月/JNI-在Java中调用C代码.md'
                }
              ]
            },
            {
              text: '4月',
              collapsed:true,
              items: [
                {
                  text:'内容安全策略(CSP)：每个Web开发人员必须了解的内容',
                  link:'/docs/article/2024/4月/内容安全策略(CSP)：每个Web开发人员必须了解的内容.md'
                },
                {
                  text:'跨站请求伪造 (CSRF) 攻击：它是什么、如何工作以及如何预防',
                  link:'docs/article/2024/4月/跨站请求伪造 (CSRF) 攻击：它是什么、如何工作以及如何预防.md'
                },
                {
                  text: 'Elasticsearch 模式下的开源',
                  link: '/docs/article/2024/4月/Elasticsearch 模式下的开源.md'
                },
                {
                  text: '利特尔定律与后端开发',
                  link: '/docs/article/2024/4月/利特尔定律与后端开发.md'
                }
              ]
            },
            {
              text: '5月',
              collapsed:true,
              items: [
                {
                  text:'项目管理：十大领域，五大过程，44个定义',
                  link:'/docs/article/2024/5月/项目管理：十大领域，五大过程，44个定义.md'
                },
                {
                  text:'最新版高级项目管理（第四版）十大知识域和49个过程',
                  link:'/docs/article/2024/5月/最新版高级项目管理（第四版）十大知识域和49个过程.md'
                }
              ]
            },
          ]
        }
      ],
      '/docs/book/': [
        {
          text: '系统设计',
          collapsed: true,
          items: [
            {
              text:'Designing Data-Intensive Applications 数据密集型应用系统设计',
              collapsed: true,
              items: [
                {  
                  text: '可靠性、可伸缩性和可维护性',
                  link: '/docs/book/系统设计/Designing Data-Intensive Applications 数据密集型应用系统设计/可靠性、可伸缩性和可维护性.md'
                },
                {  
                  text: '存储与检索',
                  link: '/docs/book/系统设计/Designing Data-Intensive Applications 数据密集型应用系统设计/存储与检索.md'
                },
                {  
                  text: '事务',
                  link: '/docs/book/系统设计/Designing Data-Intensive Applications 数据密集型应用系统设计/事务.md'
                }
              ]
            },
            {
              text:'中台架构与设计：基于DDD和微服务',
              collapsed: true,
              items: [
                {  
                  text: '认识中台',
                  link: '/docs/book/系统设计/中台架构与设计：基于DDD和微服务/认识中台.md'
                }
              ]
            }
          ]
        },
        {
          text: '字节码编程',
          collapsed: true,
          items: [
            {
              text: 'ASM用户手册',
              collapsed: true,
              items: [
                {
                  text: '介绍',
                  link: '/docs/book/Java字节码编程/ASM用户手册/介绍.md'
                },
                {
                  text: 'Core API(Classes)',
                  link: 'docs/book/Java字节码编程/ASM用户手册/Core API(Classes).md'
                },
                {
                  text: 'Tree API',
                  link: 'docs/book/Java字节码编程/ASM用户手册/Tree API.md'
                }
              ]
            },
            {
              text: 'javaassist手册',
              collapsed: true,
              items: [
                {
                  text: '读和写字节码',
                  link: '/docs/book/Java字节码编程/javassist手册/读和写字节码.md'
                },
                {
                  text:'ClassPool',
                  link:'/docs/book/Java字节码编程/javassist手册/ClassPool.md'
                },
                {
                  text:'Class loader',
                  link:'/docs/book/Java字节码编程/javassist手册/Class loader.md'
                },
                {
                  text:'自省和自定义',
                  link:'/docs/book/Java字节码编程/javassist手册/自省和自定义.md'
                },
                {
                  text:'字节码级别API',
                  link:'/docs/book/Java字节码编程/javassist手册/字节码级别API.md'
                },
                {
                  text:'泛型',
                  link:'/docs/book/Java字节码编程/javassist手册/泛型.md'
                },
                {
                  text:'其他',
                  link:'/docs/book/Java字节码编程/javassist手册/其他.md'
                }
              ]
            }
          ]
        },
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
                  text: '集群启动流程',
                  link: 'docs/book/ElasticSearch系列/ElasticSearch源码解析与优化实战/集群启动流程.md'
                },
                {
                  text: '节点的启动和关闭',
                  link: '/docs/book/ElasticSearch系列/ElasticSearch源码解析与优化实战/节点的启动和关闭.md'
                },
                {
                  text: '选主流程',
                  link: '/docs/book/ElasticSearch系列/ElasticSearch源码解析与优化实战/选主流程.md'
                },
                {
                  text: '数据模型',
                  link: '/docs/book/ElasticSearch系列/ElasticSearch源码解析与优化实战/数据模型.md'
                },
                {
                  text: '写流程',
                  link: '/docs/book/ElasticSearch系列/ElasticSearch源码解析与优化实战/写流程.md'
                },
                {
                  text: 'GET流程',
                  link: '/docs/book/ElasticSearch系列/ElasticSearch源码解析与优化实战/GET流程.md'
                },
                {
                  text: 'Search流程',
                  link: '/docs/book/ElasticSearch系列/ElasticSearch源码解析与优化实战/Search流程.md'
                },
                {
                  text: '索引恢复流程分析',
                  link: '/docs/book/ElasticSearch系列/ElasticSearch源码解析与优化实战/索引恢复流程分析.md'
                },
                {
                  text: 'gateway模块分析',
                  link: '/docs/book/ElasticSearch系列/ElasticSearch源码解析与优化实战/gateway模块分析.md'
                },
                {
                  text: 'allocation模块分析',
                  link: '/docs/book/ElasticSearch系列/ElasticSearch源码解析与优化实战/allocation模块分析.md'
                },
                {
                  text: 'ThreadPool模块分析',
                  link: '/docs/book/ElasticSearch系列/ElasticSearch源码解析与优化实战/ThreadPool模块分析.md'
                },
                {
                  text: 'Shrink原理分析',
                  link: '/docs/book/ElasticSearch系列/ElasticSearch源码解析与优化实战/Shrink原理分析.md'
                },
                {
                  text: '写入速度优化',
                  link: '/docs/book/ElasticSearch系列/ElasticSearch源码解析与优化实战/写入速度优化.md'
                },
                {
                  text: '搜索速度的优化',
                  link: '/docs/book/ElasticSearch系列/ElasticSearch源码解析与优化实战/搜索速度的优化.md'
                },
                {
                  text: '磁盘使用量优化',
                  link: '/docs/book/ElasticSearch系列/ElasticSearch源码解析与优化实战/磁盘使用量优化.md'
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
                },
                {
                  text: '标准库',
                  link: '/docs/book/Go语言系列/Go语言实战/标准库.md'
                },
                {
                  text: '测试和性能',
                  link:'/docs/book/Go语言系列/Go语言实战/测试和性能.md'
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
                  text: 'CGO编程(一)',
                  link: '/docs/book/Go语言系列/Go语言高级编程/CGO编程(一).md'
                },
                {
                  text: 'CGO编程(二)',
                  link: '/docs/book/Go语言系列/Go语言高级编程/CGO编程(二).md'
                },
                {
                  text: 'Go汇编语言(一)',
                  link: '/docs/book/Go语言系列/Go语言高级编程/Go汇编语言(一).md'
                },
                {
                  text:'Go汇编语言(二)',
                  link: '/docs/book/Go语言系列/Go语言高级编程/Go汇编语言(二).md'
                },
                {
                  text:'RPC和Protobuf',
                  link: '/docs/book/Go语言系列/Go语言高级编程/RPC和Protobuf.md'
                },{
                  text:'go 和 Web',
                  link: '/docs/book/Go语言系列/Go语言高级编程/go 和 Web.md'
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

