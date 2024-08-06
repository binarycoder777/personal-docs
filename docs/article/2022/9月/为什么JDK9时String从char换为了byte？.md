---

title: 为什么JDK9时String从char换为了byte？
author: John Doe
tags:
  - String
  - 新特性
categories:
  - String
  - 字符串
date: 2022-03-19 19:32:00
---
jdk1.8及以前String的底层是用char数组构成，但在1.9变为了byte数组，为什么呢？

首先我们知道char字符占两个字节（16位），其次字符串是堆使用的重要部分，而且大多数字符串对象只包含拉丁字符（这些字符只需一个字节的存储空间），因此对于这些字符串对象的内部char数组可能会有半数以上的空间未使用，造成空间浪费。

因此将char转化为byte来应对这种情况。新的String类将根据字符串的内存存储编码为ISO或UTF的字符。

- 注意：同String一样的Stringbuffer和Stringbuilder也同样做了修改