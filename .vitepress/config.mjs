import { text } from 'stream/consumers'
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
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
            text: "z-library",
            link:"https://zh.z-lib.gs/book/7242296/e7f29b/%E7%BC%96%E7%A8%8B%E7%8F%A0%E7%8E%91%E7%AC%AC2%E7%89%88%E4%BF%AE%E8%AE%A2%E7%89%88.html?ts=1042"
          },
          {
            text: "ChatGPT",
            link: "https://chat.openai.com/"
          },
          {
            text: "个人周刊",
            link: "https://binarycoder777.github.io/zh-cn"
          },
          {
            text:'Doraemon',
            link:'https://www.coze.cn/store/bot/7390582775252238372?bot_id=true'
          },{
            text:'力扣',
            link:'https://leetcode.cn/'
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
                },
                {
                  text:'给年轻时的自己最忠诚的建议',
                  link:'/docs/article/2024/5月/给年轻时的自己最忠诚的建议.md'
                }
              ]
            },
            {
              text: '6月',
              collapsed:true,
              items: [
                {
                  text:'认知负荷才是最重要的',
                  link:'/docs/article/2024/6月/认知负荷才是最重要的.md'
                },
                {
                  text:'你所读的内容就是你的，即使你并不总是记得它',
                  link:'/docs/article/2024/6月/你所读的内容就是你，即使你并不总是记得它.md'
                },
                {
                  text:'斐波拉契哈希算法',
                  link:'/docs/article/2024/6月/斐波拉契哈希算法.md'
                },
                {
                  text:'CRDT（无冲突复制数据类型）',
                  link:'/docs/article/2024/6月/CRDT（无冲突复制数据类型）.md'
                }
              ]
            },
            {
              text: '7月',
              collapsed:true,
              items: [
                {
                  text:'Actor模型',
                  link:'/docs/article/2024/7月/Actor模型.md'
                },
                {
                  text:'Spring中的任务调度',
                  link:'/docs/article/2024/7月/Spring中的任务调度.md'
                },
                {
                  text:'世上有多少重要的事，想着想着就算了',
                  link:'/docs/article/2024/7月/世上有多少重要的事，想着想着就算了.md'
                },
                {
                  text:'虚拟线程',
                  link:'/docs/article/2024/7月/虚拟线程.md'
                },
                {
                  text:'Java21虚拟线程-我的锁在哪',
                  link:'/docs/article/2024/7月/Java21虚拟线程-我的锁在哪.md'
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
              text:'数据密集型应用系统设计',
              collapsed: true,
              items: [
                {  
                  text: '可靠性、可伸缩性和可维护性',
                  link: '/docs/book/系统设计/Designing Data-Intensive Applications 数据密集型应用系统设计/可靠性、可伸缩性和可维护性.md'
                },
                {
                  text:'数据模型与查询语言',
                  link:'/docs/book/系统设计/Designing Data-Intensive Applications 数据密集型应用系统设计/数据模型与查询语言.md'
                },
                {  
                  text: '存储与检索',
                  link: '/docs/book/系统设计/Designing Data-Intensive Applications 数据密集型应用系统设计/存储与检索.md'
                },
                {  
                  text: '编码与演化',
                  link: '/docs/book/系统设计/Designing Data-Intensive Applications 数据密集型应用系统设计/编码与演化.md'
                },
                {  
                  text: '分区',
                  link: '/docs/book/系统设计/Designing Data-Intensive Applications 数据密集型应用系统设计/分区.md'
                },
                {  
                  text: '复制',
                  link: '/docs/book/系统设计/Designing Data-Intensive Applications 数据密集型应用系统设计/复制.md'
                },
                {  
                  text: '事务',
                  link: '/docs/book/系统设计/Designing Data-Intensive Applications 数据密集型应用系统设计/事务.md'
                },
                {  
                  text: '分布式系统的麻烦',
                  link: '/docs/book/系统设计/Designing Data-Intensive Applications 数据密集型应用系统设计/分布式系统的麻烦.md'
                },
                {  
                  text: '一致性与共识',
                  link: '/docs/book/系统设计/Designing Data-Intensive Applications 数据密集型应用系统设计/一致性与共识.md'
                },
                {  
                  text: '批处理',
                  link: '/docs/book/系统设计/Designing Data-Intensive Applications 数据密集型应用系统设计/批处理.md'
                },
                {  
                  text: '流处理',
                  link: '/docs/book/系统设计/Designing Data-Intensive Applications 数据密集型应用系统设计/流处理.md'
                },
                {  
                  text: '数据系统的未来',
                  link: '/docs/book/系统设计/Designing Data-Intensive Applications 数据密集型应用系统设计/数据系统的未来.md'
                },
              ]
            },
            {
              text:'中台架构与设计:基于DDD和微服务',
              collapsed: true,
              items: [
                {  
                  text: '认识中台',
                  link: '/docs/book/系统设计/中台架构与设计：基于DDD和微服务/认识中台.md'
                },
                {
                  text:'企业中台能力框架',
                  link:'/docs/book/系统设计/中台架构与设计：基于DDD和微服务/企业中台能力框架.md'
                },
                {
                  text:'微服务设计为什么要选择DDD',
                  link:'/docs/book/系统设计/中台架构与设计：基于DDD和微服务/微服务设计为什么要选择DDD.md'
                },
                {
                  text:'DDD、微服务和中台之间的关系',
                  link:'/docs/book/系统设计/中台架构与设计：基于DDD和微服务/DDD、微服务和中台之间的关系.md'
                },
                {
                  text:'领域和子域:有效分解问题域',
                  link:'/docs/book/系统设计/中台架构与设计：基于DDD和微服务/领域和子域:有效分解问题域.md'
                },{
                  text:'限界上下文：定义领域边界的利器',
                  link:'/docs/book/系统设计/中台架构与设计：基于DDD和微服务/限界上下文：定义领域边界的利器.md'
                },{
                  text:'实体和值对象：领域模型的基础单元',
                  link:'/docs/book/系统设计/中台架构与设计：基于DDD和微服务/实体和值对象：领域模型的基础单元.md'
                },{
                  text:'聚合和聚合根：怎样设计聚合',
                  link:'/docs/book/系统设计/中台架构与设计：基于DDD和微服务/聚合和聚合根：怎样设计聚合.md'
                },{
                  text:'领域事件：解耦微服务的关键',
                  link:'/docs/book/系统设计/中台架构与设计：基于DDD和微服务/领域事件：解耦微服务的关键.md'
                },{
                  text:'DDD分层架构',
                  link:'/docs/book/系统设计/中台架构与设计：基于DDD和微服务/DDD分层架构.md'
                },
                {
                  text:'几种微服务架构模型对比分析',
                  link:'/docs/book/系统设计/中台架构与设计：基于DDD和微服务/几种微服务架构模型对比分析.md'
                },{
                  text:'如何用事件风暴构建领域模型',
                  link:'/docs/book/系统设计/中台架构与设计：基于DDD和微服务/如何用事件风暴构建领域模型.md'
                },{
                  text:'如何用DDD重构中台业务模型',
                  link:'/docs/book/系统设计/中台架构与设计：基于DDD和微服务/如何用DDD重构中台业务模型.md'
                },{
                  text:'如何用DDD设计微服务代码模型',
                  link:'/docs/book/系统设计/中台架构与设计：基于DDD和微服务/如何用DDD设计微服务代码模型.md'
                },{
                  text:'如何保证领域模型与代码模型一致',
                  link:'/docs/book/系统设计/中台架构与设计：基于DDD和微服务/如何保证领域模型与代码模型一致.md'
                },{
                  text:'如何实现微服务的架构演进',
                  link:'/docs/book/系统设计/中台架构与设计：基于DDD和微服务/如何实现微服务的架构演进.md'
                },{
                  text:'服务和数据在微服务各层的协作',
                  link:'/docs/book/系统设计/中台架构与设计：基于DDD和微服务/服务和数据在微服务各层的协作.md'
                },{
                  text:'微服务拆分和设计原则',
                  link:'/docs/book/系统设计/中台架构与设计：基于DDD和微服务/ 微服务拆分和设计原则.md'
                },{
                  text:'分布式架构的关键设计',
                  link:'/docs/book/系统设计/中台架构与设计：基于DDD和微服务/分布式架构的关键设计.md'
                }
              ]
            },
            {
              text:'凤凰架构',
              collapsed:true,
              items:[

              ]
            },{
              text:'领域驱动设计',
              collapsed:true,
              items:[

              ]
            },{
              text:'实现领域驱动设计',
              collapsed:true,
              items:[

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
        },
        {
          text: '服务器',
          collapsed: true,
          items: [
            {
              text: '深入剖析Tomcat',
              collapsed:true,
              items:[

              ]
            },    
            {
              text: '深入剖析Negix',
              collapsed:true,
              items:[

              ]
            },     
          ],
        },
        {
          text: '数据库',
          collapsed: true,
          items: [
            {
              text: 'MySQL是怎样运行的',
              collapsed:true,
              items:[
                
              ]
            },  
            {
              text: 'MySQL技术内幕：innoDB存储引擎',
              collapsed:true,
              items:[
                
              ]
            }, 
            {
              text: '高性能MySQL',
              collapsed:true,
              items:[
                
              ]
            },  
            {
              text: 'MySQL45讲',
              collapsed:true,
              items:[
                
              ]
            },
            {
              text: 'Redis设计与实现',
              collapsed:true,
              items:[
                
              ]
            },
            {
              text: 'Redis开发与运维',
              collapsed:true,
              items:[
                
              ]
            },            
            {
              text: '深入学习MongoDB',
              collapsed:true,
              items:[
                
              ]
            },
            {
              text: 'PostgreSQL技术内幕：查询优化深度探索',
              collapsed:true,
              items:[
                
              ]
            }, 
            {
              text: 'ClickHouse原理解析与应用实践',
              collapsed:true,
              items:[
                
              ]
            },     
          ],
        },     
        {
          text: 'MQ',
          collapsed: true,
          items: [
            {
              text: '深入理解Kafka：核心设计与实践原理',
              collapsed:true,
              items:[

              ]
            },    
            {
              text: 'Apache Kafka源码剖析',
              collapsed:true,
              items:[

              ]
            },{
              text:'RocketMQ技术内幕',
              collapsed:true,
              items:[

              ]
            },
            ,{
              text:'Apache RocketMQ 源码解析',
              collapsed:true,
              items:[
                
              ]
            },
          ],
        },
        {
          text: 'RPC',
          collapsed: true,
          items: [
            {
              text: '深度剖析Apache Dubbo核心技术内幕',
              collapsed:true,
              items:[

              ]
            }      
          ],
        },
        {
          text: '网络编程',
          collapsed: true,
          items: [
            {
              text: 'Netty实战',
              collapsed:true,
              items:[
                
              ]
            },
            {
              text: 'Netty权威指南',
              collapsed:true,
              items:[
                
              ]
            }          
          ],
        },
        {
          text: '虚拟机',
          collapsed: true,
          items: [
            {
              text: '深入理解Java虚拟机：JVM高级特性与最佳实践',
              collapsed:true,
              items:[
                
              ]
            },
            {
              text: '新一代垃圾回收器ZGC设计与实现',
              collapsed:true,
              items:[
                
              ]
            },{
              text:'Java虚拟机规范 Java SE 8版',
              collapsed:true,
              items:[

              ]
            }         
          ],
        },
        {
          text: '云原生',
          collapsed: true,
          items: [
            {
              text: 'k8s in action',
              collapsed:true,
              items:[
                
              ]
            },
            {
              text: 'Docker源码分析(容器技术系列)',
              collapsed:true,
              items:[
                
              ]
            }      
          ],
        },
        {
          text: '并发',
          collapsed: true,
          items: [
            {
              text: 'Java 并发编程的艺术',
              collapsed:true,
              items:[
                
              ]
            },
            {
              text: 'Java 并发编程实战',
              collapsed:true,
              items:[
                
              ]
            }     
          ],
        },
        {
          text: '框架',
          collapsed: true,
          items: [
            {
              text: 'Spring技术内幕',
              collapsed:true,
              items:[
                
              ]
            },
            {
              text: 'SpringBoot技术内幕',
              collapsed:true,
              items:[
                
              ]
            }, 
            {
              text: 'Mybatis技术内幕',
              collapsed:true,
              items:[
                
              ]
            },      
          ],
        },
        {
          text: '其他',
          collapsed: true,
          items: [
            {
              text: '在世界尽头的咖啡馆',
              link: '/docs/book/其他/在世界尽头的咖啡馆.md'
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

