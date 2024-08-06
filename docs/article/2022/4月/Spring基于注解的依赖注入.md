---

title: Spring基于注解的依赖注入
author: John Doe
tags:
  - 注解
categories:
  - Spring
date: 2022-03-04 16:14:00
---

@Autowired是基于注解的依赖注入的核心注解，它的存在可以让容器知道需要为当前类注入哪些
依赖。比如可以使用@Autowired对类进行标注，以表明要为该类注入的依赖。

@Autowired也是按照类型匹配进行依赖注入的

@Autowired可以标注于类定义的多个位置，包括如下几个。

1、域（Filed）或者说属性（Property）。不管它们声明的访问限制符是private、protected还是public，只要标注了@Autowired，它们所需要的依赖注入需求就都能够被满足。

2、构造方法定义（Constructor）。标注于类的构造方法之上的@Autowired，相当于抢夺了原有自
动绑定功能中“constructor”方式的权利，它将根据构造方法参数类型，来决定将什么样的依赖对象注入给当前对象。

3、方法定义（Method）。@Autowired不仅可以标注于传统的setter方法之上，而且还可以标注于任
意名称的方法定义之上，只要该方法定义了需要被注入的参数。

现在，虽然可以随意地在类定义的各种合适的地方标注@Autowired，希望这些被@Autowired标
注的依赖能够被注入，但是，仅将@Autowired标注于类定义中并不能让Spring的IoC容器聪明到自己
去查看这些注解，然后注入符合条件的依赖对象。容器需要某种方式来了解，哪些对象标注了
@Autowired，哪些对象可以作为可供选择的依赖对象来注入给需要的对象。在考虑使用什么方式实
现这一功能之前，我们先比较一下原有的自动绑定功能与使用@Autowired之后产生了哪些差别。

使用自动绑定的时候，我们将所有对象相关的bean定义追加到了容器的配置文件中，然后使用
default-autowire或者autowire告知容器，依照这两种属性指定的绑定方式，将容器中各个对象绑定到一起。在使用@Autowired之后，default-autowire或者autowire的职责就转给了@Autowired，
所以，现在，容器的配置文件中就只剩下了一个个孤伶伶的bean定义

为了给容器中定义的每个bean定义对应的实例注入依赖，可以遍历它们，然后通过反射，检查每
个bean定义对应的类上各种可能位置上的@Autowired。如果存在的话，就可以从当前容器管理的对象
中获取符合条件的对象，设置给@Autowired所标注的属性域、构造方法或者方法定义。

我们可以提供一个Spring
的IoC容器使用的BeanPostProcessor自定义实现，让这个BeanPostProcessor在实例化bean定义的
过程中，来检查当前对象是否有@Autowired标注的依赖需要注入。org.springframework.beans. 
factory.annotation.AutowiredAnnotationBeanPostProcessor就是Spring提供的用于这一目的
的BeanPostProcessor实现。所以，很幸运，我们不用自己去实现它了。

相关类定义使用@Autowired标注之后，只要在IoC容器的配置文件中追加AutowiredAnnotationBeanPostProcessor就可以让整个应用开始运作了

