---

title: 将革命进行得更彻底一些（classpath-scanning 功能介绍）
author: John Doe
tags:
  - 注解
  - IOC
categories:
  - Spring
date: 2022-03-04 16:23:00
---


到目前为止，我们还是需要将相应对象的bean定义，一个个地添加到IoC容器的配置文件中。与之前唯一的区别就是，不用在配置文件中明确指定依赖关
系了（改用注解来表达了嘛）。。既然使用注解来表达对象之间的依赖注入关系，那为什么不搞的彻底
一点儿，将那些几乎“光秃秃”的bean定义从配置文件中彻底消灭呢？OK，我们想到了，Spring开发
团队也想到了，classpath-scanning的功能正是因此而诞生的！


使用相应的注解对组成应用程序的相关类进行标注之后，classpath-scanning功能可以从某一顶层
包（base package）开始扫描。当扫描到某个类标注了相应的注解之后，就会提取该类的相关信息，构
建对应的BeanDefinition，然后把构建完的BeanDefinition注册到容器。这之后所发生的事情就不
用我说了，既然相关的类已经添加到了容器，那么后面BeanPostProcessor为@Autowired或者
@Resource所提供的注入肯定是有东西拿咯！

classpath-scanning功能的触发是由<context:component-scan>决定的。

<context:component-scan>默认扫描的注解类型是@Component。不过，在@Component语义基
础上细化后的@Repository、@Service和@Controller也同样可以获得<context:component-scan>
的青睐。@Component的语义更广、更宽泛，而@Repository、@Service和@Controller的语义则更具
体。所以，同样对于服务层的类定义来说，使用@Service标注它，要比使用@Component更为确切。
对于其他两种注解也是同样道理，我们暂且使用语义更广的@Component来标注FXNews相关类，以便
摆脱每次都要向IoC容器配置添加bean定义的苦恼。

<context:component-scan>在扫描相关类定义并将它们添加到容器的时候，会使用一种默认的
命名规则，来生成那些添加到容器的bean定义的名称（beanName）。比如DowJonesNewsPersister通
过默认命名规则将获得dowJonesNewsPersister作为bean定义名称。如果想改变这一默认行为，可以指定一个自定义的名称

你或许会觉得有些诧异，因为我们并没有使用<context:annotation-config>甚至直接将相应
的BeanPostProcessor添加到容器中，而FXNewsProvider怎么会获得相应的依赖注入呢？这个得怪
<context:component-scan>“多管闲事”，它同时将AutowiredAnnotationBeanPostProcessor和
CommonAnnotationBeanPostProcessor一并注册到了容器中，所以，依赖注入的需求得以满足。如
果你不喜欢，非要自己通过 <context:annotation-config> 或者直接添加相关 BeanPostProcessor的方式来满足@Autowired或者@Resource的需求，可以将<context:component-scan>的
annotation-config属性值从默认的true改为false。