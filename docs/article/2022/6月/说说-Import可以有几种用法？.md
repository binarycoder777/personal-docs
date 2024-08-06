---

title: 说说@Import可以有几种用法？
author: John Doe
tags:
  - 面试题
categories:
  - Spring
date: 2022-03-09 18:41:00
---
1、 直接指定类 （如果配置类会按配置类正常解析、  如果是个普通类就会解析成Bean)

2、 通过ImportSelector 可以一次性注册多个，返回一个string[]  每一个值就是类的完整类路径
	
3、 通过DeferredImportSelector可以一次性注册多个，返回一个string[]  每一个值就是类的完整类路径
	
    区别：DeferredImportSelector 顺序靠后

4、 通过ImportBeanDefinitionRegistrar 可以一次性注册多个，通过BeanDefinitionRegistry来动态注册BeanDefintion