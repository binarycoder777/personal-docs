---

title: 说一说@Autowired和@Resource之间的区别
author: John Doe
tags:
  - 面试题
categories:
  - Spring
date: 2022-03-09 18:31:00
---
@Autowired可用于：构造函数、成员变量、Setter方法

@Autowired和@Resource之间的区别

@Autowired默认是按照类型装配注入的（按照名称匹配需要@Qualifier），默认情况下它要求依赖对象必须存在（可以设置它required属性为
false）。

@Resource默认是按照名称来装配注入的，只有当找不到与名称匹配的bean才会按照类型来装配注入。