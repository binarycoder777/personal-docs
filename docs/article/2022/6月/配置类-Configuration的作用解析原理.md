---

title: 配置类@Configuration的作用解析原理
author: John Doe
tags:
  - 面试题
categories:
  - Spring
date: 2022-03-09 17:00:00
---

1、@Configuration用来代替xml配置方式spring.xml配置文件 < bean>
  
2、没有@Configuration也是可以配置@Bean

3、 加了@Configuration会为配置类创建cglib动态代理（保证配置类@Bean方法调用Bean的单例），@Bean方法的调用就会通过容器.getBean进行获取

原理：

1、创建Spring上下文的时候会注册一个解析配置的处理器ConfigurationClassPostProcessor（实现BeanFactoryPostProcessor和
BeanDefinitionRegistryPostProcessor

2、在调用invokeBeanFactoryPostProcessor，就会去调用
ConfigurationClassPostProcessor.postProcessBeanDefinitionRegistry进行解析配置（解析配置类说白就是去解析各种注解
(@Bean @Configuration@Import @Component ...  就是注册BeanDefinition)

3、ConfigurationClassPostProcessor.postProcessBeanFactory去创建cglib动态代理