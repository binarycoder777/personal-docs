---

title: Spring IoC容器 ApplicationContext
author: John Doe
tags:
  - 容器
categories:
  - Spring
date: 2022-03-04 15:21:00
---

作为Spring提供的较之BeanFactory更为先进的IoC容器实现，ApplicationContext除了拥有
BeanFactory支持的所有功能之外，还进一步扩展了基本容器的功能，包括BeanFactoryPostProcessor、BeanPostProcessor以及其他特殊类型bean的自动识别、容器启动后bean实例的自动初始化、
国际化的信息支持、容器内事件发布等。

常见的ApplicationContext实现类有 

org.springframework.context.support.FileSystemXmlApplicationContext。在默认
情况下，从文件系统加载bean定义以及相关资源的ApplicationContext实现。

org.springframework.context.support.ClassPathXmlApplicationContext。在默认情况下，从Classpath加载bean定义以及相关资源的ApplicationContext实现。 

org.springframework.web.context.support.XmlWebApplicationContext。Spring提供的用于Web应用程序的ApplicationContext实现

