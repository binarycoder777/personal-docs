---

title: Spring的AOP是在哪个阶段创建的动态代理？
author: John Doe
tags:
  - AOP
  - 面试题
categories:
  - Spring
date: 2022-03-10 08:44:00
---



1、正常情况下会在bean的生命周期“初始化”后，通过BeanPostProcessor.postProcessAfterInitialization创建AOP的动态代理


2、特殊情况下，即存在循环依赖的时候，Bean会在生命周期的“属性注入”时，通过MergedBeanDefinitionPostProcessor.postProcessMergedBeanDefinition创建aop动态代理