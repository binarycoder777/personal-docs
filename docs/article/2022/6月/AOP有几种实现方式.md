---

title: "AOP有几种实现方式\_"
author: John Doe
tags:
  - AOP
categories:
  - Spring
date: 2022-03-10 08:34:00
---

1、Spring 1.2 基于接口的配置：最早的 Spring AOP 是完全基于几个接口的，想看源码的同学可以从这里起步。

2、Spring 2.0 schema-based 配置：Spring 2.0 以后使用 XML 的方式来配置，使用 命名空间 <aop ></aop>

3、Spring 2.0 @AspectJ 配置：使用注解的方式来配置，这种方式感觉是最方便的，还有，这里虽然叫
做 @AspectJ，但是这个和 AspectJ 其实没啥关系。


4、AspectJ  方式，这种方式其实和Spring没有关系，采用AspectJ 进行动态织入的方式实现AOP，需要用
AspectJ 单独编译。