---

title: 如何让自动注入找到多个依赖Bean时不报错
author: John Doe
tags:
  - 面试题
categories:
  - Spring
date: 2022-03-09 18:36:00
---
自动注入找到多个依赖Bean时，@primary可以指定注入哪一个。

@Primary：自动装配时当出现多个Bean候选者时，被注解为@Primary的Bean将作为首选者，否则将抛出异常

@Autowired 默认按类型装配，如果我们想使用按名称装配，可以结合@Qualifier注解一起使用

@Autowired @Qualifier(“personDaoBean”) 存在多个实例配合使用