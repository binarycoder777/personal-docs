---

title: 对于@Bean之间的方法调用是怎么保证单例的？
author: John Doe
tags:
  - 面试题
categories:
  - Spring
date: 2022-03-09 16:44:00
---
如果希望@bean方法返回的对象是单例，需要在类上加上@Configuration注解。

原因：Spring会使用invokeBeanFactoryPostProcessor 在内置BeanFactoryPostProcessor中使用CGLib生成动态代理，当@Bean方法进行互调时， 则会通过CGLIB进行增强，通过调用的方法名作为bean的名称去ioc容器中获取，进而保证了@Bean方法的单例 。

换句话说：被@Configuration修饰的类，spring容器中会通过cglib给这个类创建一个代理，代理会拦截所有被@Bean 修饰的方法，默认情况（bean为单例）下确保这些方法只被调用一次，从而确保这些bean是同一个bean，即单例的
。@Configuration修饰的类有cglib代理效果，默认添加的bean都为单例





