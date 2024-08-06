---

title: 要将一个第三方的类配成为Bean有哪些方式？
author: John Doe
tags:
  - 面试题
categories:
  - Spring
date: 2022-03-09 16:39:00
---
1、通过@bean注解（搭配@Configurtion）

2、通过@import注解

3、通过Spring的拓展接口BeanDefinitionRegistryPostProcessor