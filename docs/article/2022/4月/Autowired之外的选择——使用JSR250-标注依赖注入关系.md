---

title: Autowired之外的选择——使用JSR250 标注依赖注入关系
author: John Doe
tags:
  - 注解
  - 容器
categories:
  - Spring
date: 2022-03-04 16:20:00
---



除了可以使用Spring提供的@Autowired和@Qualifier来
标注相应类定义之外，还可以使用JSR250的@Resource和@PostConstruct以及@PreDestroy对相应
类进行标注，这同样可以达到依赖注入的目的。

@Resource与@Autowired不同，它遵循的是byName自动绑定形式的行为准则，也就是说，IoC容
器将根据@Resource所指定的名称，到容器中查找beanName与之对应的实例，然后将查找到的对象实
例注入给@Resource所标注的对象。

JSR250规定，如果@Resource标注于属性域或者方法之上的话，相应的容器将负责把指定的资源
注入给当前对象，所以，除了像我们这样直接在属性域上标注@Resource，还可以在构造方法或者普
通方法定义上标注@Resource，这与@Autowired能够存在的地方大致相同。

确切地说， 10 @PostConstruct和@PreDestroy不是服务于依赖注入的，它们主要用于标注对象生
命周期管理相关方法，这与Spring的InitializingBean和DisposableBean接口，以及配置项中的
init-method和destroy-method起到类似的作用。

如果想某个方法在对象实例化之后被调用，以做某些准备工作，或者想在对象销毁之前调用某个
方法清理某些资源，那么就可以像我们这样，使用@PostConstruct和@PreDestroy来标注这些方法。
当然，是使用@PostConstruct和@PreDestroy，还是使用Spring的InitializingBean和Disposable-Bean接口，或者init-method和destroy-method配置项，可以根据个人的喜好自己决定。

天上永远不会掉馅饼，我们只是使用@Resource或者@PostConstruct和@PreDestroy标注了相应
对象，并不能给该对象带来想要的东西。所以，就像@Autowired需要AutowiredAnnotationBeanPostProcessor为它与IoC容器牵线搭桥一样，JSR250的这些注解也同样需要一个BeanPostProcessor帮助它们实现自身的价值。这个BeanPostProcessor就是org.springframework.context. 
annotation.CommonAnnotationBeanPostProcessor，只有将CommonAnnotationBeanPostProcessor添
加到容器，JSR250的相关注解才能发挥作用

既然不管是@Autowired还是@Resource都需要添加相应的BeanPostProcessor到容器，那么我们
就可以在基于XSD的配置文件中使用一个<context:annotation-config>配置搞定以上所有的
BeanPostProcessor配置

<context:annotation-config> 不但帮我们把 AutowiredAnnotationBeanPostProcessor 和
CommonAnnotationBeanPostProcessor注册到容器，同时还会把PersistenceAnnotationBeanPostProcessor和RequiredAnnotationBeanPostProcessor一并进行注册，可谓一举四得啊！
