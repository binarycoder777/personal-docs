---

title: Spring的AOP通知执行顺序
author: John Doe
tags:
  - AOP
  - 面试题
categories:
  - Spring
date: 2022-03-09 21:25:00
---

执行顺序：

    5.2.7之前：

    1、正常执行：@Before­­­>方法­­­­>@After­­­>@AfterReturning
    2、异常执行：@Before­­­>方法­­­­>@After­­­>@AfterThrowing



    5.2.7之后：

    1、正常执行：@Before­­­>方法­­­­>@AfterReturning­­­>@After
    2、异常执行：@Before­­­>方法­­­­>@AfterThrowing­­­>@After